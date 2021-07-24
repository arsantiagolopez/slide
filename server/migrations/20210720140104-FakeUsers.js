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
        id: "1",
        email: "arsantiagolopez@gmail.com",
        password:
          "$argon2i$v=19$m=4096,t=3,p=1$+J7375KYQZpW7VRbNUKtEw$BwSrH3S3QK+o07haUAj68wvO3cTD3QPA5eXWIxHRXa0",
        name: "Alexander Santiago",
        picture: "https://avatars.githubusercontent.com/u/53582710?v=4",
        created_at: "2021-07-22 21:13:07",
        updated_at: "2021-07-22 21:13:07",
      },
      {
        id: "2c43d3d3-9da3-4fba-ab27-aec303ded447",
        email: "devin@devin.com",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Devin Tarrell",
        picture:
          "https://images.unsplash.com/photo-1546456073-92b9f0a8d413?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fGZhY2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        created_at: "2015-11-28 21:13:07",
        updated_at: "2015-11-28 21:13:07",
      },
      {
        id: "d68e5627-f1d3-4afe-9500-7216a264d103",
        email: "andrea@andrea.com",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Andrea Gretto",
        picture:
          "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        created_at: "2018-11-30 23:46:03",
        updated_at: "2018-11-30 23:46:03",
      },
      {
        id: "7a2e620c-af93-4315-9fff-d94c48ce9025",
        email: "mateo@mateo.com",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Mateo Pannizardi",
        picture:
          "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8ZmFjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        created_at: "2021-05-07 06:56:32",
        updated_at: "2021-05-07 06:56:32",
      },
      {
        id: "9ee9661f-7ecb-4c2e-a120-7ea8c5eada92",
        email: "elizabeth@elizabeth.com",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Elizabeth Harris",
        picture:
          "https://images.pexels.com/photos/1669158/pexels-photo-1669158.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        created_at: "2018-12-27 12:45:43",
        updated_at: "2018-12-27 12:45:43",
      },
      {
        id: "782bcad2-bc2d-4dw35-a776-ce6aeawd1d1",
        email: "conor@conor.com",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Conor Grillin",
        picture:
          "https://images.unsplash.com/photo-1594819047050-99defca82545?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDZ8fGZhY2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        created_at: "2019-10-15 21:34:04",
        updated_at: "2019-10-15 21:34:04",
      },
      {
        id: "12c9721d-0b5c-4b9d-b69c-3f3b7141a677",
        email: "justin@justin.com",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Justin Blue",
        picture:
          "https://images.pexels.com/photos/3768689/pexels-photo-3768689.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        created_at: "2019-09-05 08:30:12",
        updated_at: "2019-09-05 08:30:12",
      },
      {
        id: "8d55eb5f-75f6-409b-96b2-29776aa86273",
        email: "martha@martha.com",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Martha Villarreal",
        picture:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTF8fGZhY2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        created_at: "2017-05-07 17:58:49",
        updated_at: "2017-05-07 17:58:49",
      },
      {
        id: "563bcad2-bc2d-4435-a776-ce6ae4612cd1",
        email: "rebecca@rebecca.com",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Rebecca Ridge",
        picture:
          "https://images.pexels.com/photos/3155586/pexels-photo-3155586.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        created_at: "2019-10-15 21:37:07",
        updated_at: "2019-10-15 21:37:07",
      },
      {
        id: "da6c0227-0a8f-46cd-bcc0-ef8351c6ba59",
        email: "whitney@whitney.com",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Whitney Sal",
        picture:
          "https://images.pexels.com/photos/1854169/pexels-photo-1854169.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        created_at: "2017-07-09 09:36:29",
        updated_at: "2017-07-09 09:36:29",
      },
      {
        id: "1167h28d-0a8f-46cd-bcc0-ef8351c6ba59",
        email: "stefania@stefania.com",
        password:
          "$argon2i$v=19$m=16,t=2,p=1$eUhNUWxXVDZzd3UwenQ0aw$ivTwYq/i8S38VyTHOJ1M9w",
        name: "Stefania Salamanca",
        picture:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjl8fGZhY2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        created_at: "2017-07-09 09:21:23",
        updated_at: "2017-07-09 09:21:23",
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
