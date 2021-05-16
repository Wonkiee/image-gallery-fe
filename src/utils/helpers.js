import { map, filter, find, isEmpty } from 'lodash';

/**
 * Generates coloumn, row count for a table
 * @param  {Number} tableEntriesLength
 */
const getTableProperties = (tableEntriesLength) => {
  const nearestSq = Math.pow(Math.round(Math.sqrt(tableEntriesLength)), 2);
  const columnCount = Math.sqrt(nearestSq);
  const remainingTableEntryCount = tableEntriesLength - nearestSq;
  const extraRowsNeeded = Math.floor((remainingTableEntryCount / columnCount) + 1);
  return {rowsCount: extraRowsNeeded + columnCount, columnCount: columnCount };
}

/**
 * For requets payload to save images in db
 * @param  {Object} checkBoxStatusMap
 * @param  {Array} allImagesList
 * @param  {Array} imageOrder
 */
const getRequestPayloadForImageSave = (checkBoxStatusMap, allImagesList, imageOrder) => {
  let checkedCheckBoxIds = [];
  console.log("checkBoxStatusMap ",checkBoxStatusMap)
  map(checkBoxStatusMap, (status, id) => {
    if (status) {
      checkedCheckBoxIds.push(id);
    }
  });
  checkedCheckBoxIds = checkedCheckBoxIds.map(Number);
  imageOrder = imageOrder.map(Number);
console.log("checkedCheckBoxIds", checkedCheckBoxIds);
console.log("imageOrder", imageOrder);
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