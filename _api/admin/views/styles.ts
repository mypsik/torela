export const styles = `<style>
  th, td {
    position: relative; 
    text-align: left; 
    vertical-align: top; 
    padding: 5px; 
  }
  
  tbody tr:hover { 
    background-color: #f5f5f5; 
  }
  
  td > button {
    position: absolute;
    right: 0; 
    bottom: 0;
    display: none;
  }
  
  td:hover > button { 
    display: block; 
  }
  
  tr.public { 
    background-color: rgba(255,226,74,0.49); 
  }
</style>`
