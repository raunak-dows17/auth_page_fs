class User {
  constructor({ id, profileImage, name, email, password, phoneNo }) {
    this._id = id;
    this.profileImage = profileImage;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phoneNo = phoneNo;
  }

  // Additional methods or validations can be added here
}

module.exports = User;
