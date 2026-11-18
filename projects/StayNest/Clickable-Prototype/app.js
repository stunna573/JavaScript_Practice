
function confirmBooking(e){
  e.preventDefault();
  const t=document.getElementById('toast');
  t.textContent='Booking confirmed! (Demo only)';
  t.style.display='block';
  setTimeout(()=>t.style.display='none',3000);
}
