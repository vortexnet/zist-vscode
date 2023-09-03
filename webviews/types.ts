// /* eslint-disable @typescript-eslint/naming-convention */
//   // export type Files = {
//   //   [filename: string]: GistFileType;
//   // };

//   export type GistFileType = {
//     filename: string;
//     type: string;
//     language: string;
//     raw_url: string;
//     size: number;
//   };
  
//   export type User = {
//     name: string;
//     bio: string;
//     login: string;
//     id: number;
//     node_id: string;
//     avatar_url: string;
//     gravatar_id: string;
//     url: string;
//     html_url: string;
//     followers_url: string;
//     following_url: string;
//     gists_url: string;
//     starred_url: string;
//     subscriptions_url: string;
//     organizations_url: string;
//     repos_url: string;
//     events_url: string;
//     received_events_url: string;
//     type: string;
//     site_admin: boolean;
//     followers: number;
//     public_gists: number;
//   };

// export type Gist = {
//     url: string;
//     forks_url: string;
//     commits_url: string;
//     id: string;
//     node_id: string;
//     git_pull_url: string;
//     git_push_url: string;
//     html_url: string;
//     files: Files;
//     public: boolean;
//     created_at: string;
//     updated_at: string;
//     description: string;
//     comments: number;
//     user: null;
//     comments_url: string;
//     owner: User;
//     forks: any[]; 
//     history: History[];
//     truncated: boolean;
//   };
  
//   export interface GistData {
//     data: Gist[];
//   }