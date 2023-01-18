module.exports = addressValidate = async (address) => {
  let addr = address.split(' ');
  if (addr[0] == '서울시') {
    addr[0] = '서울특별시';
  }

  return addr.splice(0, 4).join(' ');
}