export const makeCapital = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const parseForDropDown = (array, name, id) => {
  const option = [];
  for (let element of array) {
    option.push({
      label: makeCapital(element[name]),
      value: element[id]
    });
  }
  return option;
};

export const parseAccounts = accounts => {
  const options = [];
  for (let account of accounts) {
    const name = account.account_name ? makeCapital(account.account_name) : "";
    const label =
      name +
      " " +
      makeCapital(account.account_type) +
      " " +
      account.currency_type;
    options.push({ value: account.account_id, label });
  }
  return options;
};

// export const parseCategories = ({
//   resultAll,
//   resultParent,
//   resultParentWithoutChild
// }) => {
//   const option = [];
//   option.push(...parseForDropDown(resultParentWithoutChild, "parent", "id"));
//   for (let categ of resultParent) {
//     let { id, parent } = categ;
//     parent = makeCapital(parent);
//     const items = [];
//     items.push({ value: id, label: parent });
//     for (let elemnt of resultAll) {
//       let { id: child_id, child, parent_id } = elemnt;
//       if (parent_id === id) {
//         child = makeCapital(child);
//         items.push({ value: child_id, label: child });
//       }
//     }
//     option.push({ label: parent, options: items });
//   }
//   return option;
// };

function proccedData(nodes, element, idx = 1, parent_name = "") {
  console.log(element);
  if (!element.name_path) {
    return nodes;
  }
  if (element.name_path.length === 1) {
    nodes.push({
      value: element.child_id,
      label: makeCapital(element.name),
      options: [{ value: element.child_id, label: makeCapital(element.name) }]
    });
    return nodes;
  }

  const parent_id = element.name_path[idx];
  for (let i = 0; i < nodes.length; ++i) {
    if (nodes[i].value === parent_id) {
      if (element.name_path.length === idx + 1) {
        nodes[i].options.push({
          label: makeCapital(element.name),
          value: element.child_id,
          options: []
        });
        return nodes;
      } else {
        proccedData(nodes[i].options, element, idx + 1);
        return nodes;
      }
    }
  }
  nodes.push({
    value: parent_id,
    label: makeCapital(element.name),
    options: []
  });
  if (element.name_path.length === idx + 1) {
    nodes[nodes.length - 1].options.push({
      label: makeCapital(element.name),
      value: element.child_id,
      options: []
    });
    return nodes;
  } else {
    proccedData(nodes[nodes.length - 1].options, element, idx + 1);
  }
  return nodes;
}

export const parseCategories = data => {
  if (!data) {
    return [];
  }
  const options = [];
  for (let i = 0; i < data.length; ++i) {
    proccedData(options, data[i]);
  }
  return options;
};
