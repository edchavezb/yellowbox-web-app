const defaultBoxes = [
  {
    id: "1234",
    name: "Favoritos Español",
    available: "public",
    creator: "eKDNF346",
    description: "Mis favoritos en el español",
    artists: [],
    albums: [],
    playlists: [],
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
    artists: [
      {external_urls:{spotify:"https://open.spotify.com/artist/6woxBLnpyz3ARR9SyEZujZ"},id:"6woxBLnpyz3ARR9SyEZujZ",images:[{height:640,url:"https://i.scdn.co/image/3c3b00fb152622d5a2a9ff79fb216df745b18b33",width:640},{height:320,url:"https://i.scdn.co/image/cdfec3041450b5e0c74b377c16cddedb8dfb978d",width:320},{height:160,url:"https://i.scdn.co/image/6f22fe35f9f1c4a005a18e38d44f2acce9a55919",width:160}],name:"Alexei Rocha",popularity:1,type:"artist",uri:"spotify:artist:6woxBLnpyz3ARR9SyEZujZ",subSection:"default"},
      {external_urls:{spotify:"https://open.spotify.com/artist/0du5cEVh5yTK9QJze8zA0C"},id:"0du5cEVh5yTK9QJze8zA0C",images:[{height:640,url:"https://i.scdn.co/image/c1ee384b2fe0ea8e9df0b194a17d6b41b2b7993a",width:640},{height:320,url:"https://i.scdn.co/image/aba91de7087e3b657cf11e98c45026ac6b7df544",width:320},{height:160,url:"https://i.scdn.co/image/b958dfcbcfed9af560764c04c4afc19381744892",width:160}],name:"Bruno Mars",popularity:93,type:"artist",uri:"spotify:artist:0du5cEVh5yTK9QJze8zA0C",subSection:"default"},
      {external_urls:{spotify:"https://open.spotify.com/artist/20wkVLutqVOYrc0kxFs7rA"},id:"20wkVLutqVOYrc0kxFs7rA",images:[{height:640,url:"https://i.scdn.co/image/f9dbecfbec79585821a0058c96fde9a57b9c106c",width:640},{height:320,url:"https://i.scdn.co/image/560a6a1784f38953c82e98344d3f3dde6fa79a93",width:320},{height:160,url:"https://i.scdn.co/image/dad2ec3fc54f36f983f131660a3a01aa6e5559a8",width:160}],name:"Daniel Caesar",popularity:89,type:"artist",uri:"spotify:artist:20wkVLutqVOYrc0kxFs7rA",subSection:"default"},
      {external_urls:{spotify:"https://open.spotify.com/artist/3IZxs4ZukiitIk8vkAPAxC"},id:"3IZxs4ZukiitIk8vkAPAxC",images:[{height:640,url:"https://i.scdn.co/image/1fb8b73866315153318626101f596494486b0971",width:640},{height:320,url:"https://i.scdn.co/image/5914ca3ba3e8f149ed0d53ca0776d8df3a3ba11a",width:320},{height:160,url:"https://i.scdn.co/image/df891882c2d5511e8949b1fae0d7bf40e69a8e6d",width:160}],name:"Vanessa Zamora",popularity:50,type:"artist",uri:"spotify:artist:3IZxs4ZukiitIk8vkAPAxC",subSection:"default"}
    ],
    albums: [
      {album_type:"album",artists:[{external_urls:{spotify:"https://open.spotify.com/artist/4d53BMrRlQkrQMz5d59f2O"},href:"https://api.spotify.com/v1/artists/4d53BMrRlQkrQMz5d59f2O",id:"4d53BMrRlQkrQMz5d59f2O",name:"Mayer Hawthorne",type:"artist",uri:"spotify:artist:4d53BMrRlQkrQMz5d59f2O"}],external_urls:{spotify:"https://open.spotify.com/album/5pFEKvjZm4W8NSAS5VzmiR"},id:"5pFEKvjZm4W8NSAS5VzmiR",images:[{height:640,url:"https://i.scdn.co/image/ab67616d0000b273e00d0863a410da5d8d443ed1",width:640},{height:300,url:"https://i.scdn.co/image/ab67616d00001e02e00d0863a410da5d8d443ed1",width:300},{height:64,url:"https://i.scdn.co/image/ab67616d00004851e00d0863a410da5d8d443ed1",width:64}],name:"How Do You Do",release_date:"2011-01-01", total_tracks: 13,type:"album",uri:"spotify:album:5pFEKvjZm4W8NSAS5VzmiR",subSection:"default"},
      {album_type:"album",artists:[{external_urls:{spotify:"https://open.spotify.com/artist/0hEurMDQu99nJRq8pTxO14"},href:"https://api.spotify.com/v1/artists/0hEurMDQu99nJRq8pTxO14",id:"0hEurMDQu99nJRq8pTxO14",name:"John Mayer",type:"artist",uri:"spotify:artist:0hEurMDQu99nJRq8pTxO14"}],external_urls:{spotify:"https://open.spotify.com/album/6WivmTXugLZLmAWnZhlz7g"},id:"6WivmTXugLZLmAWnZhlz7g",images:[{height:640,url:"https://i.scdn.co/image/ab67616d0000b2731a4c7c7e6eeaee67c9e8ce71",width:640},{height:300,url:"https://i.scdn.co/image/ab67616d00001e021a4c7c7e6eeaee67c9e8ce71",width:300},{height:64,url:"https://i.scdn.co/image/ab67616d000048511a4c7c7e6eeaee67c9e8ce71",width:64}],name:"Heavier Things",release_date:"2003-09-09",total_tracks: 10,type:"album",uri:"spotify:album:6WivmTXugLZLmAWnZhlz7g",subSection:"default"},
      {album_type:"album",artists:[{external_urls:{spotify:"https://open.spotify.com/artist/4d53BMrRlQkrQMz5d59f2O"},href:"https://api.spotify.com/v1/artists/4d53BMrRlQkrQMz5d59f2O",id:"4d53BMrRlQkrQMz5d59f2O",name:"Mayer Hawthorne",type:"artist",uri:"spotify:artist:4d53BMrRlQkrQMz5d59f2O"}],external_urls:{spotify:"https://open.spotify.com/album/5MBHKaOoI0GPDg9moUCZor"},id:"5MBHKaOoI0GPDg9moUCZor",images:[{height:640,url:"https://i.scdn.co/image/ab67616d0000b27371bf98334c981b940838111e",width:640},{height:300,url:"https://i.scdn.co/image/ab67616d00001e0271bf98334c981b940838111e",width:300},{height:64,url:"https://i.scdn.co/image/ab67616d0000485171bf98334c981b940838111e",width:64}],name:"Man About Town",release_date:"2016-02-19",total_tracks: 10,type:"album",uri:"spotify:album:5MBHKaOoI0GPDg9moUCZor",subSection:"default"},
      {album_type:"album",artists:[{external_urls:{spotify:"https://open.spotify.com/artist/3Uqu1mEdkUJxPe7s31n1M9"},href:"https://api.spotify.com/v1/artists/3Uqu1mEdkUJxPe7s31n1M9",id:"3Uqu1mEdkUJxPe7s31n1M9",name:"Weyes Blood",type:"artist",uri:"spotify:artist:3Uqu1mEdkUJxPe7s31n1M9"}],external_urls:{spotify:"https://open.spotify.com/album/0Cuqhgy8vm96JEkBY3polk"},id:"0Cuqhgy8vm96JEkBY3polk",images:[{height:640,url:"https://i.scdn.co/image/ab67616d0000b2730c64e752dec4c08362cc4a88",width:640},{height:300,url:"https://i.scdn.co/image/ab67616d00001e020c64e752dec4c08362cc4a88",width:300},{height:64,url:"https://i.scdn.co/image/ab67616d000048510c64e752dec4c08362cc4a88",width:64}],name:"Titanic Rising",release_date:"2019-04-05",total_tracks: 10,type:"album",uri:"spotify:album:0Cuqhgy8vm96JEkBY3polk",subSection:"default"}
    ],
    playlists: [
      {
        description: "Al cien con los corridos, ¡para un buen ejercicio!",
        external_urls: {
            spotify: "https://open.spotify.com/playlist/37i9dQZF1DXaMxIh88NH1N"
        },
        href: "https://api.spotify.com/v1/playlists/37i9dQZF1DXaMxIh88NH1N",
        id: "37i9dQZF1DXaMxIh88NH1N",
        images: [
            {
                height: null,
                url: "https://i.scdn.co/image/ab67706f00000003033f8707da9cae3e8fce0cf4",
                width: null
            }
        ],
        name: "Bien Machín",
        owner: {
            display_name: "Spotify",
            external_urls: {
                spotify: "https://open.spotify.com/user/spotify"
            },
            href: "https://api.spotify.com/v1/users/spotify",
            id: "spotify",
            type: "user",
            uri: "spotify:user:spotify"
        },
        public: null,
        snapshot_id: "MTYzMzYzOTM2NSwwMDAwMDAwMGQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0Mjdl",
        tracks: {
            "href": "https://api.spotify.com/v1/playlists/37i9dQZF1DXaMxIh88NH1N/tracks",
            "total": 100
        },
        type: "playlist",
        uri: "spotify:playlist:37i9dQZF1DXaMxIh88NH1N"
      }
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
      },
      playlists: {
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
      tracks: true,
      playlists: true
    },
    subSections : [
      {type: "artists", name: "Da Best"},
      {type: "artists", name: "Super hits"},
    ]
  }
];

export default defaultBoxes;