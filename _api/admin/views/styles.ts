export const styles = `<style>
  body {
    font-family: sans-serif;
  }
  
  h1 > * {
    vertical-align: middle;
  }
  
  h1 > label {
    font-size: 1rem;
    font-weight: normal;
  }

  th, td {
    position: relative; 
    text-align: left; 
    vertical-align: top; 
    padding: 5px; 
  }
  
  tbody tr:hover { 
    background-color: rgba(240,240,240,0.5); 
  }
  
  td > button {
    position: absolute;
    right: 0; 
    bottom: 0;
    display: none;
  }

  td > button:nth-of-type(2) {
    right: 2em; 
  }
  
  td:hover > button { 
    display: block; 
  }
  
  tr.public { 
    background-color: rgba(255,226,74,0.49); 
  }
</style>`
