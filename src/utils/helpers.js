import { map, filter, find, isEmpty } from 'lodash';

const getTableProperties = (tableEntriesLength) => {
  const nearestSq = Math.pow(Math.round(Math.sqrt(tableEntriesLength)), 2);
  const columnCount = Math.sqrt(nearestSq);
  const remainingTableEntryCount = tableEntriesLength - nearestSq;
  const extraRowsNeeded = Math.floor((remainingTableEntryCount / columnCount) + 1);
  return {rowsCount: extraRowsNeeded + columnCount, columnCount: columnCount };
}

const getRequestPayloadForImageSave = (checkBoxStatusMap, allImagesList, imageOrder) => {
  let checkedCheckBoxIds = [];
  map(checkBoxStatusMap, (status, id) => {
    if (status) {
      checkedCheckBoxIds.push(id);
    }
  });
  checkedCheckBoxIds = checkedCheckBoxIds.map(Number);
  imageOrder = imageOrder.map(Number);

  const imageObjectsList = filter(allImagesList, (image) => {
    return checkedCheckBoxIds.includes(image.id);
  });
  const orderedImageObjectsList = map(imageOrder, (imgId, index) => {
    const imgObject = find(imageObjectsList, { id: imgId });
    if (!isEmpty(imgObject)) {
      imgObject.order = index;
      return imgObject;
    }
  })
  const payload = {};
  payload.images = orderedImageObjectsList;
  return payload;
}
export default {
  getTableProperties,
  getRequestPayloadForImageSave
};