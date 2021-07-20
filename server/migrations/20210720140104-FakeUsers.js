"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.bulkInsert("users", [
      {
        id: "2c43d3d3-9da3-4fba-ab27-aec303ded447",
        email: "test@test.com",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Test User",
        picture:
          "https://images.unsplash.com/photo-1546456073-92b9f0a8d413?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fGZhY2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        created_at: "2015-11-28 21:13:07",
        updated_at: "2015-11-28 21:13:07",
      },
      {
        id: "56777989-a951-43ad-949b-2118867ce6d6",
        email: "justinbieber@justinbieber.com",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Justin Bieber",
        picture:
          "https://i.pinimg.com/originals/f9/9b/a6/f99ba68c77855203372285ea95f2cea9.jpg",
        created_at: "2020-06-21 09:51:17",
        updated_at: "2020-06-21 09:51:17",
      },
      {
        id: "0674af62-3772-4bef-9870-f0441dbf466b",
        email: "msalkeld2@slashdot.org",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Mikel Santos",
        picture:
          "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        created_at: "2019-06-21 02:27:39",
        updated_at: "2019-06-21 02:27:39",
      },
      {
        id: "d68e5627-f1d3-4afe-9500-7216a264d103",
        email: "dknevet3@hhs.gov",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Donna Kivell",
        picture:
          "https://images.pexels.com/photos/3789888/pexels-photo-3789888.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        created_at: "2018-11-30 23:46:03",
        updated_at: "2018-11-30 23:46:03",
      },
      {
        id: "7a2e620c-af93-4315-9fff-d94c48ce9025",
        email: "rtwiddle4@wordpress.com",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Wesley Beakes",
        picture:
          "https://images.pexels.com/photos/3786525/pexels-photo-3786525.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        created_at: "2015-10-07 06:56:32",
        updated_at: "2015-10-07 06:56:32",
      },
      {
        id: "9ee9661f-7ecb-4c2e-a120-7ea8c5eada92",
        email: "bwabe5@woothemes.com",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Montel Lead",
        picture:
          "https://images.pexels.com/photos/1669158/pexels-photo-1669158.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        created_at: "2018-12-27 12:45:43",
        updated_at: "2018-12-27 12:45:43",
      },
      {
        id: "12c9721d-0b5c-4b9d-b69c-3f3b7141a677",
        email: "jcollet6@latimes.com",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Valentine Ball",
        picture:
          "https://images.pexels.com/photos/3768689/pexels-photo-3768689.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        created_at: "2019-09-05 08:30:12",
        updated_at: "2019-09-05 08:30:12",
      },
      {
        id: "8d55eb5f-75f6-409b-96b2-29776aa86273",
        email: "cwhittaker7@hostgator.com",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Rob Whittaker",
        picture:
          "https://images.pexels.com/photos/3811717/pexels-photo-3811717.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        created_at: "2017-05-07 17:58:49",
        updated_at: "2017-05-07 17:58:49",
      },
      {
        id: "da6c0227-0a8f-46cd-bcc0-ef8351c6ba59",
        email: "agrayham8@amazon.com",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Sal Stanovsky",
        picture:
          "https://images.pexels.com/photos/1854169/pexels-photo-1854169.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        created_at: "2017-07-09 09:36:29",
        updated_at: "2017-07-09 09:36:29",
      },
      {
        id: "563bcad2-bc2d-4435-a776-ce6ae4612cd1",
        email: "hayrs9@noaa.gov",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Panther Ridge",
        picture:
          "https://images.pexels.com/photos/3155586/pexels-photo-3155586.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        created_at: "2019-10-15 21:34:04",
        updated_at: "2019-10-15 21:34:04",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.bulkDelete("users", null, {});
  },
};
