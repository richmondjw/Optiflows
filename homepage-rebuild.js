/* Progressive enhancement: navigation and page content do not depend on JavaScript. */
(() => {
 const form=document.getElementById('leadForm');
 const submit=document.getElementById('leadSubmit');
 const status=document.getElementById('formStatus');
 const success=document.getElementById('formSuccess');
 if(!form||!submit||!status||!success)return;
 const label=submit.innerHTML;
 const track=(name,properties={})=>{if(typeof window.gtag==='function')window.gtag('event',name,properties)};
 document.querySelectorAll('a[href="#contact"]').forEach(a=>a.addEventListener('click',()=>track('contact_open')));
 let started=false;
 form.addEventListener('focusin',()=>{if(started)return;started=true;window.OptiflowsLeadCapture?.initialise(form);track('diagnostic_form_start')});
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(submit.disabled||!form.reportValidity())return;
  status.textContent='Sending your enquiry…';submit.disabled=true;submit.textContent='Sending…';form.setAttribute('aria-busy','true');
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),15000);
  try{
   if(!window.OptiflowsLeadCapture)throw Error('unavailable');
   await window.OptiflowsLeadCapture.submit(form,{source:window.location.pathname,signal:controller.signal});
   form.hidden=true;success.hidden=false;success.focus();track('generate_lead',{inquiry_type:'consultancy_enquiry'});
  }catch{
   status.replaceChildren(document.createTextNode('Your enquiry could not be confirmed. Please try again or '));
   const email=document.createElement('a');email.href='mailto:hello@optiflows.com.au';email.textContent='email James';status.append(email,document.createTextNode('. Your details are still here.'));status.focus();track('diagnostic_form_error');
  }finally{clearTimeout(timeout);submit.disabled=false;submit.innerHTML=label;form.removeAttribute('aria-busy')}
 });
 document.getElementById('sendAnother')?.addEventListener('click',()=>{form.reset();delete form.dataset.leadCaptureId;form.querySelector('[name="form_started_at"]')?.remove();started=false;status.textContent='';success.hidden=true;form.hidden=false;document.getElementById('fullName').focus()});
})();
