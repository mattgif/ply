'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	firstName: String,
	lastName: String,	
	spaces: Array
});

UserSchema.methods.serialize = function() {
	return {
		email: this.email || '',
		username: this.username || '',
		firstName: this.firstName || '',
		lastName: this.lastName || '',
		spaces: this.spaces || []
	}
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const SpaceSchema = mongoose.Schema({
	spaceID: {
		type: String,		
		unique: true
	},
	title: {
		type: String,
		required: true
	},
	type: String,
	owner: String,
	description: String,
	amenities: {
		electricity: Boolean,
		heat: Boolean,
		water: Boolean,
		bathroom: Boolean
	},
	coverImage: String,
	availability: Object,
	hourly: Boolean,
	daily: Boolean,
	monthly: Boolean,
	longTerm: Boolean,
	location: {
		type: {type: String, default:'Point'},
		coordinates: Array
	},
	rates: Object,
	street: String,
	city: String,
	state: String,
	zip: String
});

SpaceSchema.index({location: '2dsphere'});

const User = mongoose.model('User', UserSchema);
const Space = mongoose.model('Space', SpaceSchema);

module.exports = {User, Space};