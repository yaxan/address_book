export interface Name {
    title: string;
    first: string;
    last: string;
  }
  
  export interface User {
    id: {
      uuid: string;
    };
    name: Name;
  }
  