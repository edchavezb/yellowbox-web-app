export const reorderItems = (items: Array<any>, sourceIndex: number, destinationIndex: number) => {
  const [targetItem] = items.splice(sourceIndex, 1);
  items.splice(destinationIndex, 0, targetItem);

  return items;
}