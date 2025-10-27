import ContentsModel from '../../models/ContentModel';
import CreatorsModel from '../../models/CreatorModel';
import ActivitiesModel from '../../models/ActivityModel';
import { getItemsWithScore } from './getItemsWithScore';
import { appendCreatorToContent } from './appendCreatorToContent';

export const paginate = (pubsub) => {
  return async (_, args, context) => {
    const { page } = args;
    const skip = page.page - 1;
    const compare = page.sort === 'DESC' ? -1 : 1;
    const { searchTerm } = page;
    const { searchBy } = page;
    const { dateRange } = page;
    let total = 0;

    switch (page.type) {
      case 'Content':
        let contents = [];

        const filterArgs = {};
        if (searchBy === 'date_range') {
          const { from, to } = dateRange;
          filterArgs.created = {
            $gte: new Date(from).toISOString(),
            $lte: new Date(to).toISOString(),
          };
        }

        if (searchTerm) {
          filterArgs.$text = { $search: searchTerm };
        }

        total = await ContentsModel.find(filterArgs).count();
        contents = await ContentsModel.find(filterArgs)
          .sort({ score: compare })
          .skip(skip * page.limit)
          .limit(page.limit);

        const contentsWithScore = await getItemsWithScore(contents, 'contentId');
        const detailedContents = await appendCreatorToContent(contentsWithScore);
        return { ...page, data: detailedContents, total };
      case 'Creator':
        let creators = [];
        if (searchTerm) {
          total = await CreatorsModel.find({ $text: { $search: searchTerm } }).count();
          creators = await CreatorsModel.find({ $text: { $search: searchTerm } })
            .sort({ score: compare })
            .skip(skip * page.limit)
            .limit(page.limit);
        } else {
          total = await CreatorsModel.count({});
          creators = await CreatorsModel.find({})
            .sort({ score: compare })
            .skip(skip * page.limit)
            .limit(page.limit);
        }
        const creatorsWithScore = await getItemsWithScore(creators, 'creatorId');
        return { ...page, data: creatorsWithScore, total };
      case 'Activity':
        total = await ActivitiesModel.count({});
        const activities = await ActivitiesModel.find({})
          .sort({ created: compare })
          .skip(skip * page.limit)
          .limit(page.limit);
        return { ...page, data: activities, total };
      default:
    }
  };
};
