import ContentsModel from '../../models/ContentModel';
import CreatorsModel from '../../models/CreatorModel';
import VoteLogsModel from '../../models/VoteLogModel';

export const generateVoteLogs = async (vote, text) => {
  const content = await ContentsModel.findById(vote.contentId);
  const creator = await CreatorsModel.findById(vote.creatorId);
  const votelogsData = {
    userId: vote.userId,
    voteId: vote._id,
    title: content.title,
    author: creator.name,
    action: vote.type,
    tokens: vote.points,
    description: text,
    created: new Date(),
  };
  await new VoteLogsModel(votelogsData).save();
};
