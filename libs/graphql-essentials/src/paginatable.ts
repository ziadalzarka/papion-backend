import { ConfigUtils } from 'app/config/config.util';

const performPaginatableFind = async (model, query, sort, page = 1, projection = {}) => {
  return await model.find(query, projection)
    .skip((page - 1) * ConfigUtils.metadata.pageSize)
    .limit(ConfigUtils.metadata.pageSize)
    .sort(sort)
    .exec();
};

const countPages = async (model, query) => {
  const total = await model.countDocuments(query).exec();
  const division = total / ConfigUtils.metadata.pageSize;
  const floored = Math.floor(division);
  const pages = floored === division ? floored : floored + 1;
  return { total, pages };
};

export const performPaginatableQuery = async (model, query, sort, page, projection = {}) => {
  const edges = await performPaginatableFind(model, query, sort, page, projection);
  const stats = await countPages(model, query);
  return { edges, ...stats, hasNext: stats.pages > page };
};
