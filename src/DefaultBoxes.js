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
        ascendingOrder: false,
        subSections: false
      },
      albums: {
        primarySorting: "custom",
        secondarySorting: "none",
        view: "grid",
        ascendingOrder: false,
        subSections: false
      },
      tracks: {
        primarySorting: "custom",
        secondarySorting: "none",
        view: "grid",
        ascendingOrder: false,
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
    albums: [],
    tracks: [],
    sectionSorting: {
      artists: {
        primarySorting: "custom",
        view: "grid",
        ascendingOrder: false,
        subSections: true
      },
      albums: {
        primarySorting: "custom",
        secondarySorting: "none",
        view: "grid",
        ascendingOrder: false,
        subSections: false
      },
      tracks: {
        primarySorting: "custom",
        secondarySorting: "none",
        view: "grid",
        ascendingOrder: false,
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