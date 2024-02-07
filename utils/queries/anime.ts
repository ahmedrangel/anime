import * as gql from "gql-query-builder";
import { Language, Sort } from "~/enums/anilist";

export const queryAnime = (options?: Record<string, any>) => {
  for (const key in options) {
    if (!options[key]) delete options[key];
  }
  const query = gql.query({
    operation: "Media",
    variables: { id: Number(options?.id) },
    fields: [
      "id",
      { title: ["romaji", "english", "native"] },
      { coverImage: ["extraLarge"] },
      "bannerImage",
      { startDate: ["year", "month", "day"] },
      { endDate: ["year", "month", "day"] },
      "description",
      "season",
      "seasonYear",
      "format",
      "status",
      "episodes",
      "duration",
      "genres",
      "synonyms",
      "source",
      "averageScore",
      "hashtag",
      "countryOfOrigin",
      { trailer: ["id", "site"] },
      { nextAiringEpisode: ["airingAt", "timeUntilAiring", "episode"] },
      { studios: [
        { edges: [
          "isMain",
          { node: ["id", "name"] }
        ]}
      ]},
      { externalLinks: ["id", "site", "url", "icon"] },
      { streamingEpisodes: ["site", "title", "thumbnail", "url"] },
      { operation: "characters",
        variables: {
          perPage: 9,
          characterSort: { name: "sort", type: "[CharacterSort]", value: [Sort.ROLE, Sort.RELEVANCE, Sort.ID] }
        },
        fields: [
          { edges: [
            "id",
            "role",
            "name",
            { node: [
              "id",
              { name: ["userPreferred"] },
              { image: ["large"] },
            ]},
            { operation: "voiceActors",
              variables: {
                staffLanguage: { name: "language", type: "StaffLanguage", value: Language.JAPANESE },
                staffSort: { name: "sort", type: "[StaffSort]", value: [Sort.RELEVANCE, Sort.ID] }
              },
              fields: [
                "id",
                { name: ["userPreferred"] },
                { image: ["large"] },
              ]
            }
          ]}
        ]
      },
      { operation: "staff",
        variables: {
          staffSort: { name: "sort", type: "[StaffSort]", value: [Sort.RELEVANCE, Sort.ID] }
        },
        fields: [
          { edges: [
            "id",
            "role",
            { node: [
              "id",
              { name: ["userPreferred"] },
              { image: ["large"] },
            ]}
          ]}
        ]
      },
      { operation: "recommendations",
        variables: {
          perPage: 6,
          recommendationSort: { name: "sort", type: "[RecommendationSort]", value: [Sort.RATING_DESC, Sort.ID] },
        },
        fields: [
          { nodes: [
            "id",
            { mediaRecommendation: [
              "id",
              { title: ["romaji", "english", "native"] },
              "format",
              { startDate: ["year", "month", "day"] },
              { coverImage: ["extraLarge"] },
              "averageScore"
            ]}
          ]}
        ]
      }
    ]
  });
  return JSON.stringify(query);
};

export const queryAnimeSlug = (id: number) => {
  const query = gql.query({
    operation: "Media",
    variables: { id },
    fields: [
      "id",
      { title: ["romaji"] }
    ]
  });
  return JSON.stringify(query);
};