export async function NestAwait(obj) {
  if (obj.then) {
    return await obj;
  } else if (Array.isArray(obj)) {
    return await Promise.all(obj.map(field => NestAwait(field)));
  } else if (typeof obj === 'object') {
    const awaited = {};
    const keys = Object.keys(obj);
    for (const key of keys) {
      awaited[key] = await NestAwait(obj[key]);
    }
    return awaited;
  } else {
    return obj;
  }
}

export const ProcessGraphQLUploadArgs = NestAwait;
