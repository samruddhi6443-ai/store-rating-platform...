const buildSearchFilter = (search, fields) => {
  if (!search) return undefined;

  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: search,
        mode: "insensitive"
      }
    }))
  };
};

const buildSort = (sort, order, allowedFields, defaultField = "createdAt") => {
  const normalizedOrder = order === "asc" ? "asc" : "desc";
  const field = allowedFields.includes(sort) ? sort : defaultField;

  return { [field]: normalizedOrder };
};

module.exports = {
  buildSearchFilter,
  buildSort
};
