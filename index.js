const { ApolloServer } = require('apollo-server');

const port = 9000;

const teams = [
  {
    id: 'team_0',
    name: 'Real Salt Lake',
    playerIds: ['player_0', 'player_1'],
  },
  {
    id: 'team_1',
    name: 'LA Galaxy',
    playerIds: ['player_2', 'player_3'],
  },
  {
    id: 'team_2',
    name: 'D.C. United',
    playerIds: ['player_4', 'player_5'],
  },
];

const players = [
  {
    id: 'player_0',
    name: 'Alvin Jones',
  },
  {
    id: 'player_1',
    name: 'Aaron Herrera',
  },
  {
    id: 'player_2',
    name: 'David Bingham',
  },
  {
    id: 'player_3',
    name: 'Jonathan dos Santos',
  },
  {
    id: 'player_4',
    name: 'Oniel Fisher',
  },
  {
    id: 'player_5',
    name: 'Junior Moreno',
  },
];

let teamsIdIndex = teams.length - 1;
let playerIdIndex = players.length - 1;

// typeDefs will describe the graphql schema
const typeDefs = `
  type Team {
    id: ID!
    name: String!
    players: [Player]
  }

  type Player {
    id: ID!
    name: String!
    team: Team!
  }

  type Query {
    allTeams: [Team!]
    teamByName(name: String!): Team!
    teamById(id: ID!): Team!
    allPlayers: [Player!]
    playerByName(name: String!): Player!
    playerById(id: ID!): Player!
  }

  type Mutation {
    createTeam (
      name: String!
    ): Team
    createPlayer (
      teamName: String!
      name: String!
    ): Player
  }
`;


// The resolvers define how each call will return its data
const resolvers = {
  Query: {
    allTeams: (root, args, context) => {
      return teams;
    },
    teamByName: (root, args, context) => {
      return teams.find((team) => team.name === args.name);
    },
    teamById: (root, args, context) => {
      return teams.find((team) => team.id === args.id);
    },
    allPlayers: (root, args, context) => {
      return players;
    },
    playerByName: (root, args, context) => {
      return players.find((player) => player.name === args.name);
    },
    playerById: (root, args, context) => {
      return players.find((player) => player.id === args.id);
    },
  },
  Mutation: {
    createTeam: (root, args, context) => {
      const newTeam = {
        id: `team_${++teamsIdIndex}`,
        name: args.name,
        playerIds: []
      };
      teams.push(newTeam);

      return newTeam;
    },
    createPlayer: (root, args, context) => {
      const newPlayer = {
        id: `player_${++playerIdIndex}`,
        name: args.name,
      };
      const team = teams.forEach((team) => {
        if (team.name === args.teamName) team.playerIds.push(newPlayer.id);
      });
      
      players.push(newPlayer);

      return newPlayer;
    },
  },
  Team: {
    players: (root, args, context) => {
      return players.filter((player) => {
        return root.playerIds.find((playerIds) => playerIds === player.id);
      });
    },
  },
  Player: {
    team: (root, args, context) => {
      return teams.find((team) => {
        return team.playerIds.find((playerId) => playerId === root.id);
      });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen(9000).then(({ url }) => {
  console.info(`🚀 Server ready at ${url}`);
});
