import CollectionModel from '../../models/CollectionModel';

export const getCollection = (pubsub) => {
  return async (_, args, context) => {
    switch (context.domain) {
      case 'hiphop':
        let collection = {};
        if (!args.collectionId) { collection = await CollectionModel.findOne({ ...args }); } else collection = await CollectionModel.findById(args.collectionId);

        if (!collection) return await upsertAlbum(args.option);
        return collection;

      default:
        return await CollectionModel.findById(args.collectionId);
    }
  };
};
