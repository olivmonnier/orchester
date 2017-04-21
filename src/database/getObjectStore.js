export default function (table, db, mode = 'readonly') {
  const tx = db.transaction(table, mode);
  
  return tx.objectStore(table);
}
