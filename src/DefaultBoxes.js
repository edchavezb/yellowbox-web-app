const defaultBoxes = [
  {
    id: "1234",
    name: "Favoritos Español",
    available: "public",
    creator: "eKDNF346",
    description: "Mis favoritos en el español",
    artists: [],
    albums: [],
    tracks: [],
    sectionSorting: {
      artists: {
        primarySorting: "custom",
        view: "grid",
        ascendingOrder: true,
        subSections: false
      },
      albums: {
        primarySorting: "custom",
        secondarySorting: "none",
        view: "grid",
        ascendingOrder: true,
        subSections: false
      },
      tracks: {
        primarySorting: "custom",
        secondarySorting: "none",
        view: "grid",
        ascendingOrder: true,
        subSections: false
      }
    },
    sectionVisibility: {
      artists: true,
      albums: true,
      tracks: true
    },
    subSections : [
      {type: "artists", name: "Da Worst"}
    ]
  },
  {
    id: "2454",
    name: "Top 2020",
    available: "public",
    creator: "eKDNF346",
    description: "Top albums from 2020",
    artists: [],
    albums: [
      {album_type:"album",artists:[{external_urls:{spotify:"https://open.spotify.com/artist/4d53BMrRlQkrQMz5d59f2O"},href:"https://api.spotify.com/v1/artists/4d53BMrRlQkrQMz5d59f2O",id:"4d53BMrRlQkrQMz5d59f2O",name:"Mayer Hawthorne",type:"artist",uri:"spotify:artist:4d53BMrRlQkrQMz5d59f2O"}],external_urls:{spotify:"https://open.spotify.com/album/5pFEKvjZm4W8NSAS5VzmiR"},id:"5pFEKvjZm4W8NSAS5VzmiR",images:[{height:640,url:"https://i.scdn.co/image/ab67616d0000b273e00d0863a410da5d8d443ed1",width:640},{height:300,url:"https://i.scdn.co/image/ab67616d00001e02e00d0863a410da5d8d443ed1",width:300},{height:64,url:"https://i.scdn.co/image/ab67616d00004851e00d0863a410da5d8d443ed1",width:64}],name:"How Do You Do",release_date:"2011-01-01",type:"album",uri:"spotify:album:5pFEKvjZm4W8NSAS5VzmiR",subSection:"default"},
      {album_type:"album",artists:[{external_urls:{spotify:"https://open.spotify.com/artist/0hEurMDQu99nJRq8pTxO14"},href:"https://api.spotify.com/v1/artists/0hEurMDQu99nJRq8pTxO14",id:"0hEurMDQu99nJRq8pTxO14",name:"John Mayer",type:"artist",uri:"spotify:artist:0hEurMDQu99nJRq8pTxO14"}],external_urls:{spotify:"https://open.spotify.com/album/6WivmTXugLZLmAWnZhlz7g"},id:"6WivmTXugLZLmAWnZhlz7g",images:[{height:640,url:"https://i.scdn.co/image/ab67616d0000b2731a4c7c7e6eeaee67c9e8ce71",width:640},{height:300,url:"https://i.scdn.co/image/ab67616d00001e021a4c7c7e6eeaee67c9e8ce71",width:300},{height:64,url:"https://i.scdn.co/image/ab67616d000048511a4c7c7e6eeaee67c9e8ce71",width:64}],name:"Heavier Things",release_date:"2003-09-09",type:"album",uri:"spotify:album:6WivmTXugLZLmAWnZhlz7g",subSection:"default"},
      {album_type:"album",artists:[{external_urls:{spotify:"https://open.spotify.com/artist/4d53BMrRlQkrQMz5d59f2O"},href:"https://api.spotify.com/v1/artists/4d53BMrRlQkrQMz5d59f2O",id:"4d53BMrRlQkrQMz5d59f2O",name:"Mayer Hawthorne",type:"artist",uri:"spotify:artist:4d53BMrRlQkrQMz5d59f2O"}],external_urls:{spotify:"https://open.spotify.com/album/5MBHKaOoI0GPDg9moUCZor"},id:"5MBHKaOoI0GPDg9moUCZor",images:[{height:640,url:"https://i.scdn.co/image/ab67616d0000b27371bf98334c981b940838111e",width:640},{height:300,url:"https://i.scdn.co/image/ab67616d00001e0271bf98334c981b940838111e",width:300},{height:64,url:"https://i.scdn.co/image/ab67616d0000485171bf98334c981b940838111e",width:64}],name:"Man About Town",release_date:"2016-02-19",type:"album",uri:"spotify:album:5MBHKaOoI0GPDg9moUCZor",subSection:"default"}
    ],
    tracks: [],
    sectionSorting: {
      artists: {
        primarySorting: "custom",
        view: "grid",
        ascendingOrder: true,
        subSections: true
      },
      albums: {
        primarySorting: "custom",
        secondarySorting: "none",
        view: "grid",
        ascendingOrder: true,
        subSections: false
      },
      tracks: {
        primarySorting: "custom",
        secondarySorting: "none",
        view: "grid",
        ascendingOrder: true,
        subSections: false
      }
    },
    sectionVisibility: {
      artists: true,
      albums: true,
      tracks: true
    },
    subSections : [
      {type: "artists", name: "Da Best"},
      {type: "artists", name: "Super hits"},
    ]
  }
];

export default defaultBoxes;