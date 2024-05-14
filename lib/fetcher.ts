interface Ifetcher{
  url:string,
  data?:BodyInit | null,
}

export const fetcher = ({url, data=null}:Ifetcher) => fetch(url,{body:data}).then((res) => res.json());
