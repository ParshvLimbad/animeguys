// src/lib/anilist.js

export const API = 'https://graphql.anilist.co';

export async function gql(query, variables = {}) {
  if (typeof query !== 'string' || !query.trim()) {
    throw new Error('DEV: gql() called without a GraphQL query string');
  }

  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables }),
    // cache on the server for a minute to avoid hammering the API
    next: { revalidate: 60 },
  });

  const text = await res.text();
  let json;
  try { json = JSON.parse(text); }
  catch { throw new Error('AniList returned non-JSON: ' + text.slice(0, 200)); }

  if (!res.ok || json.errors) {
    throw new Error(json.errors?.[0]?.message || 'GraphQL error');
  }
  return json.data;
}

export const Q = {
  TRENDING: `
    query Trending($page:Int=1,$perPage:Int=24){
      Page(page:$page, perPage:$perPage){
        pageInfo{ currentPage hasNextPage }
        media(type:ANIME, sort:TRENDING_DESC){
          id
          title{ romaji english native }
          coverImage{ large extraLarge }
          averageScore
          season
          seasonYear
          format
          bannerImage
        }
      }
    }
  `,
  POPULAR: `
    query Popular($page:Int=1,$perPage:Int=24){
      Page(page:$page, perPage:$perPage){
        pageInfo{ currentPage hasNextPage }
        media(type:ANIME, sort:POPULARITY_DESC){
          id
          title{ romaji english native }
          coverImage{ large extraLarge }
          averageScore
          season
          seasonYear
          format
          bannerImage
        }
      }
    }
  `,
  SEASONAL: `
    query Seasonal($season:MediaSeason!,$seasonYear:Int!,$page:Int=1,$perPage:Int=24){
      Page(page:$page, perPage:$perPage){
        pageInfo{ currentPage hasNextPage }
        media(type:ANIME, season:$season, seasonYear:$seasonYear, sort:POPULARITY_DESC){
          id
          title{ romaji english native }
          coverImage{ large extraLarge }
          averageScore
          season
          seasonYear
          format
          bannerImage
        }
      }
    }
  `,
  SEARCH: `
    query Search($q:String,$page:Int=1,$perPage:Int=24,$format:[MediaFormat],$genre:[String],$year:Int){
      Page(page:$page, perPage:$perPage){
        pageInfo{ currentPage hasNextPage }
        media(
          type:ANIME
          search:$q
          sort:POPULARITY_DESC
          format_in:$format
          genre_in:$genre
          seasonYear:$year
        ){
          id
          title{ romaji english native }
          coverImage{ large }
          averageScore
          seasonYear
          format
          genres
          bannerImage
        }
      }
    }
  `,
  DETAIL: `
    query AnimeDetail($id:Int!,$airPage:Int=1,$revPage:Int=1){
      Media(id:$id, type:ANIME){
        id
        title{ romaji english native }
        description(asHtml:false)
        coverImage{ extraLarge }
        bannerImage
        averageScore
        episodes
        duration
        genres
        rankings{ rank type allTime year season context }
        tags{ id name rank isGeneralSpoiler isMediaSpoiler }
        externalLinks{ site url type }
        streamingEpisodes{ title thumbnail url }
        characters(page:1, perPage:12, sort:[ROLE,RELEVANCE]){
          edges{
            role
            node{ id name{ full } image{ large } }
            voiceActors(language:JAPANESE, sort:[RELEVANCE]){
              id
              name{ full }
              image{ large }
            }
          }
        }
        staff(perPage:10, sort:[RELEVANCE, ID]){
          edges{
            role
            node{ id name{ full } image{ large } }
          }
        }
        reviews(page:$revPage, perPage:5, sort:RATING_DESC){
          nodes{
            id
            summary
            body(asHtml:false)
            score
            rating
            ratingAmount
            createdAt
            user{ name avatar{ large } }
          }
        }
      }
      Page(page:$airPage, perPage:25){
        airingSchedules(mediaId:$id, sort:TIME){
          id
          episode
          airingAt
        }
      }
    }
  `,
  GENRES: `query Genres{ GenreCollection }`,
};

export async function fetchDetail(id, airPage = 1, revPage = 1) {
  return gql(Q.DETAIL, { id: Number(id), airPage, revPage });
}

// Export both named and default to avoid import mismatches
const defaultExport = { API, gql, Q, fetchDetail };
export default defaultExport;
