// process is defined in 'NodeJS.Process' 
declare  namespace  NodeJS  { 
    interface  Process  { 
      server :  boolean ; 
      browser :  boolean ; 
    }
    interface Global {
      fetch: typeof fetch;
    }
  }