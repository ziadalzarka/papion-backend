import { ConfigUtils } from 'app/config/config.util';

const performPaginatableFind = async (model, query, sort, page = 1) => {
  return await model.find(query)
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

export const performPaginatableQuery = async (model, query, sort, page) => {
  const items = await performPaginatableFind(model, query, sort, page);
  const pages = await countPages(model, query);
  return { items, pages, hasNext: pages > page };
};
