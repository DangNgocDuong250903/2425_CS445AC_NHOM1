export const user = {
  _id: "64df3c064180b81adfe41d4b",
  firstName: "Ha",
  lastName: "Tuan",
  email: "hatuan1423@gmail.com",
  profession: "Web developer",
  friends: [
    {
      _id: "64df3aec4180b81adfe41d32",
      firstName: "John",
      lastName: "Bruce",
      email: "john@gmail.com",
      friends: ["64df3c064180b81adfe41d4b", "64df39704180b81adfe41d0b"],
      views: [],
      verified: true,
      createdAt: "2023-08-18T09:33:32.519Z",
      updatedAt: "2023-08-18T09:49:19.475Z",
      __v: 2,
      profileUrl:
        "https://res.cloudinary.com/djs3wu5bg/image/upload/v1683874470/cld-sample.jpg",
    },
    {
      _id: "64df39704180b81adfe41d0b",
      firstName: "James",
      lastName: "Jackson",
      email: "james@gmail.com",
      friends: ["64df3c064180b81adfe41d4b", "64df3aec4180b81adfe41d32"],
      views: [
        "64df39704180b81adfe41d0b",
        "64df39704180b81adfe41d0b",
        "64df39704180b81adfe41d0b",
        "64df39704180b81adfe41d0b",
        "64df39704180b81adfe41d0b",
        "64df39704180b81adfe41d0b",
      ],
      verified: true,
      createdAt: "2023-08-18T09:27:12.064Z",
      updatedAt: "2023-08-21T06:46:26.798Z",
      __v: 8,
      location: "Mumbai, India",
      profession: "Full-Stack Developer",
    },
    {
      _id: "64df424b4a4c0d47b5369f65",
      firstName: "User",
      lastName: "One",
      email: "user!@gmail.com",
      friends: ["64df3c064180b81adfe41d4b"],
      views: [],
      verified: true,
      createdAt: "2023-08-18T10:04:59.677Z",
      updatedAt: "2023-08-18T10:09:20.006Z",
      __v: 1,
    },
  ],
  views: [
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
    "64df39704180b81adfe41d0b",
  ],
  verified: true,
  createdAt: "2023-08-18T09:38:14.179Z",
  updatedAt: "2023-08-21T06:46:18.258Z",
  profileUrl:
    "https://res.cloudinary.com/djs3wu5bg/image/upload/v1683874454/samples/people/boy-snow-hoodie.jpg",
  token: "hZWFmZmU3NmMiLCJpYXQiOjE2OTIwMzY5",
};

export const friends = [
  {
    _id: "64df3aec4180b81adfe41d32",
    firstName: "Ngoc",
    lastName: "Duong",
    email: "john@gmail.com",
    profileUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk-vbPLtYJm0nLT9icuT2VT1wl-fAa3LzBdQ&s",
  },
  {
    _id: "64df39704180b81adfe41d0b",
    firstName: "Mohamed",
    lastName: "Salah",
    email: "james@gmail.com",
    location: "Mumbai, India",
    profileUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Mohamed_Salah_2018.jpg",
    profession: "Full-Stack Developer",
  },
  {
    _id: "64df424b4a4c0d47b5369f65",
    firstName: "Virgil",
    lastName: "Vandijk",
    profileUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvZ5tlwcyX69noUottK0EDi6CZJS76ds-vqw&s",
    email: "user!@gmail.com",
  },
];

export const groups = [
  {
    _id: "64df3aec4180b81adfe41d32",
    name: "Liverpool supporter club",
    groupUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR3rRz-xWBkv8kSBOZsb5AZHqjLQfElqPjIw&s",
  },
  {
    _id: "64df3aec4180b81adfe41d32",
    name: "Thực tập sinh IT Đà Nẵng",
    groupUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIcWvu_0VqEWbRCXHXlDsEKVtGfIj9quQrLg&s",
  }
];

export const requests = [
  {
    _id: "64df3aec4180b81adfe41d32",
    requestFrom: friends[0],
  },
  {
    _id: "64df39704180b81adfe41d0b",
    requestFrom: friends[1],
  },
  {
    _id: "64df424b4a4c0d47b5369f65",
    requestFrom: friends[2],
  },
];

export const suggests = [
  {
    _id: "64df3aec4180b81adfe41d32",
    ...friends[0],
  },
  {
    _id: "64df39704180b81adfe41d0b",
    ...friends[1],
  },
  {
    _id: "64df424b4a4c0d47b5369f65",
    ...friends[2],
  },
];
export const posts = [
  {
    _id: "67498e87a2974bd5a3db536b",
    userId: {
      _id: "64df39704180b81adfe41d0b",
      firstName: "Ha",
      lastName: "Tuan",
      profileUrl:
        "https://res.cloudinary.com/djs3wu5bg/image/upload/v1683874454/samples/people/boy-snow-hoodie.jpg",
      location: "Liverpool, England",
    },
    description: "Hello everyone, my club is 1st in the world!",
    image:
      "https://static-images.vnncdn.net/vps_images_publish/000001/000003/2024/11/10/salah-bung-no-liverpool-xay-chac-ngoi-dau-ngoai-hang-anh-51091.jpg?width=0&s=LjTSUBZacHgxQRl9mg-8VA",
    likes: ["64df3c064180b81adfe41d4b"],
    comments: [],
    createdAt: "2023-08-21T06:04:18.297Z",
    updatedAt: "2023-08-21T06:04:18.297Z",
    __v: 0,
  },
  {
    _id: "64df3ed06c2bd953c7b43172",
    userId: {
      _id: "64df39704180b81adfe41d0b",
      firstName: "Cristiano ",
      lastName: "Ronaldo",
      profileUrl:
        "https://m.yodycdn.com/blog/toc-mi-tom-nam-yodyvn-98ca695e-9146-4ada-96f9-5733a8706401.jpg",
      location: "Saudi Arabia",
    },
    description:
      " What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  Why do we use it? It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    likes: ["64df39704180b81adfe41d0b"],
    comments: ["64e2dc8577e497bd3a0bf843"],
    createdAt: "2023-08-18T09:50:08.431Z",
    updatedAt: "2023-08-21T03:44:36.962Z",
    __v: 0,
    video:
      "https://res.cloudinary.com/duktr2ml5/video/upload/v1733144620/cxe0mi0xohrqgecylpy8.mp4",
  },
];

export const postComments = [
  {
    _id: "64df43e04a4c0d47b536a02a",
    userId: {
      _id: "64df424b4a4c0d47b5369f65",
      firstName: "User",
      lastName: "One",
    },
    postId: "64df3ef86c2bd953c7b43193",
    comment: "hahahah",
    from: "User One",
    likes: ["64df39704180b81adfe41d0b"],
    replies: [],
    createdAt: "2023-08-18T10:11:44.091Z",
    updatedAt: "2023-08-21T03:37:03.927Z",
    __v: 0,
  },
  {
    _id: "64df41b14a4c0d47b5369f4d",
    userId: {
      _id: "64df39704180b81adfe41d0b",
      firstName: "MTech",
      lastName: "Solutions",
      profileUrl:
        "https://res.cloudinary.com/djs3wu5bg/image/upload/v1692299991/SOCIALMEDIA/fvws1unsqytcqketv78w.png",
      location: "Mumbai, India",
    },
    postId: "64df3ef86c2bd953c7b43193",
    comment: "i would like to have them in my house",
    from: "MTech Solutions",
    likes: ["64df39704180b81adfe41d0b"],
    replies: [],
    createdAt: "2023-08-18T10:02:25.492Z",
    updatedAt: "2023-08-21T03:27:57.602Z",
    __v: 0,
  },
  {
    _id: "64df41304a4c0d47b5369f0d",
    userId: {
      _id: "64df3aec4180b81adfe41d32",
      firstName: "Akwasi",
      lastName: "Asante",
      profileUrl:
        "https://res.cloudinary.com/djs3wu5bg/image/upload/v1683874470/cld-sample.jpg",
    },
    postId: "64df3ef86c2bd953c7b43193",
    comment: "This dogs are too serious!",
    from: "Akwasi Asante",
    likes: ["64df39704180b81adfe41d0b"],
    replies: [
      {
        userId: {
          _id: "64df39704180b81adfe41d0b",
          firstName: "MTech",
          lastName: "Solutions",
          profileUrl:
            "https://res.cloudinary.com/djs3wu5bg/image/upload/v1692299991/SOCIALMEDIA/fvws1unsqytcqketv78w.png",
          location: "Mumbai, India",
        },
        from: "MTech Solutions",
        replyAt: "Akwasi Asante",
        comment: "Not easy, hahahah",
        created_At: "2023-08-18T10:01:08.771Z",
        updated_At: "2023-08-18T09:56:38.344Z",
        likes: [],
        _id: "64df41644a4c0d47b5369f24",
      },
    ],
    createdAt: "2023-08-18T10:00:16.352Z",
    updatedAt: "2023-08-18T10:01:14.090Z",
    __v: 1,
  },
];

export const messages = [
  {
    _id: "64df3aec4180b81adfe41d32",
    firstName: "Ngoc",
    lastName: "Duong",
    message: 'alo',
    status: 'active',
    profileUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk-vbPLtYJm0nLT9icuT2VT1wl-fAa3LzBdQ&s",
  },
  {
    _id: "64df39704180b81adfe41d0b",
    firstName: "Mohamed",
    lastName: "Salah",
    message: "hello my friend",
    status: 'inactive',
    profileUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Mohamed_Salah_2018.jpg",
  },
  {
    _id: "64df424b4a4c0d47b5369f65",
    firstName: "Virgil",
    lastName: "Vandijk",
    message: "i love you",
    status: 'active',
    profileUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvZ5tlwcyX69noUottK0EDi6CZJS76ds-vqw&s",
  },
]
