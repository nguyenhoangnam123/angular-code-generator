const objInterface = {
  stt: {
    type: 'number',
    isPrimitive: true,
    display: true
  },
  id: {
    type: 'number',
    isPrimitive: true,
    display: false
  },
  userName: {
    type: 'string',
    isPrimitive: true,
    display: true,
    validate: [
      {
        type: 'minLength',
        value: 3,
        message: 'tên đăng nhập không ít hơn 3 ký tự'
      },
      {
        type: 'maxLength',
        value: 10,
        message: 'tên đăng nhập không nhiều hơn 10 ký tự'
      }
    ]
  },
  firstName: {
    type: 'string',
    isPrimitive: true,
    display: true
  },
  email: {
    type: 'string',
    isPrimitive: true,
    display: true,
    validate: [
      {
        type: 'pattern',
        value: '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
        message: 'email không hợp lệ'
      }
    ]
  },
  phoneNumber: {
    type: 'string',
    isPrimitive: true,
    display: true,
    validate: [
      {
        type: 'pattern',
        value: '[0-9]\\d{9}',
        message: 'số điện thoại không hợp lệ'
      }
    ]
  }
  // role: {
  //   type: 'IRole[]',
  //   isMapping: true,
  //   display: true
  // }
};

export default objInterface;
