// MOVER COMMON HELPER FUNCTIONS

function isCharacterALetter(char) {
  return /[a-zA-Z]/.test(char);
}

export function isSection(section) {
  return isCharacterALetter(section.charAt(0));
}

export function isOrder(order) {
  return order.split('-')[1] === '346';
}

export function isParcel(parcel) {
  const parcelPart = parcel.split('-')[1];
  return (
    parcelPart === '505' || // SMALL PARCEL
    parcelPart === '506' || // MEDIUM PARCEL
    parcelPart === '507' //    BIG PARCEL
  );
}

export function isCourierSack(sack) {
  return sack.split('-')[1] === '446';
}
