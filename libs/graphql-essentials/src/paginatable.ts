import { ConfigUtils } from 'app/config/config.util';

const performPaginatableFind = async (model, query, sort, page = 1, projection = {}) => {
  return await model.find(query, projection)
    .skip((page - 1) * ConfigUtils.metadata.pageSize)
    .limit(ConfigUtils.metadata.pageSize)
    .sort(sort)
    .exec();
};

const countPages = async (model, query) => {
  const count = await model.countDocuments(query).exec();
  const division = count / ConfigUtils.metadata.pageSize;
  const floored = Math.floor(division);
  return floored === division ? floored : floored + 1;
};

export const performPaginatableQuery = async (model, query, sort, page, projection = {}) => {
  const edges = await performPaginatableFind(model, query, sort, page, projection);
  const pages = await countPages(model, query);
  return { edges, pages, hasNext: pages > page };
};
