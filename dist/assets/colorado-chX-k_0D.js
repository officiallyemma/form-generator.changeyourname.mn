import{d as i,r as s}from"./index-DrJ6mbSC.js";function r(e){if(typeof e=="string"){var n=e.split("-");return n.length===3?[n[1],n[2],n[0]].join("-"):e}var t=new Date(e),a=""+(t.getMonth()+1),o=""+t.getDate(),l=t.getFullYear();return a.length<2&&(a="0"+a),o.length<2&&(o="0"+o),[a,o,l].join("-")}let d={name:"co-form-generator",demo:!0,version:"0.0.0",form:[{type:"comment",html:`
            <div class="card header-card">
            <img src="banner.webp" height="100" alt="Name Change Form Generator" />
            <h1>Colorado Trans Name Change Court Document Generator</h1>
            <p class="body-text">
               Copy Goes Here
                <br />
                <br />
                This form makes a number of assumptions in order to "just work" for the most amount of people. Please see the full list of assumptions this form generator will make on the
                <a href="https://changeyourname.mn#introduction">main page</a>
                .
            </p>


            <div class="sub-card sub-card--info">
                <p>
                <strong>Security Notice:</strong>
                Everything runs locally in your browser, meaning your data doesn't get sent anywhere. This app is
                <a href="https://github.com/officiallyemma/form-generator.changeyourname.mn" target="_blank" rel="noopener">open source</a> and you're welcome to review or audit the code yourself.
                </p>
            </div>
            </div>
`},{headerText:"1. Current Legal Name",headerIcon:"person",fields:[{id:"currentFirstName",label:"Current Legal First Name",supportingText:"As shown on official documents",type:"text"},{id:"currentMiddleName",label:"Current Legal Middle Name",supportingText:"Leave blank if none",type:"text"},{id:"currentLastName",label:"Current Legal Last Name",supportingText:"As shown on official documents",type:"text"},{id:"dateOfBirth",label:"Date of Birth",type:"date",supportingText:""}]},{headerText:"2. New Legal Name",headerIcon:"badge",fields:[{id:"newFirstName",label:"New First Name",supportingText:"Your chosen first name",type:"text"},{id:"newMiddleName",label:"New Middle Name",supportingText:"Leave blank if none",type:"text"},{id:"newLastName",label:"New Last Name",supportingText:"Your chosen last name",type:"text"}]},{headerText:"4. Contact Information",headerIcon:"contact_mail",fields:[{id:"address",label:"Street Address",supportingText:"Include apartment/unit number",type:"text"},{id:"city",label:"City",type:"text",value:"",supportingText:""},{id:"state",label:"State",type:"text",value:"Minnesota",supportingText:""},{id:"zip",label:"ZIP Code",type:"text",value:"",supportingText:""},{id:"county",label:"County",supportingText:"e.g. Hennepin, Ramsey, Dakota",type:"text"},{id:"phone",label:"Phone Number",supportingText:"Include area code",type:"tel"},{id:"email",label:"Email Address",supportingText:"Court will use this for updates",type:"email"}]},{type:"comment",html:`
                
                    <div class="card sub-card sub-card--info">
                        <h2>Blah Blah Blah explanation of why the court asks for a reason. what the "default" reason is "im trans and need a name that's fitting and proper" and that this allows you to add a reason</h2>
                        <p>
                        </p>
                    </div>
                    `},{headerText:"5. (Optional) Short Narrative Statement",headerIcon:"contact_mail",fields:[{id:"narrative",label:"Name Change Reason",supportingText:"Why are you changing your name? (0-2 sentences is sufficient)",type:"text"}]},{type:"comment",html:`

                <div class="card">
                    <div class="sub-card sub-card--warning">
                        <h2>Insert Disclaimer Text Here Lorem Ipsum Don't Sue Me</h2>
                        <p>
                            <strong>Important Disclaimer:</strong>
                            <u>You</u> are responsible for checking the validity of the information in these forms prior to submitting to the courts.
                            <b>I am not a lawyer, and the software I wrote definitely isn't one either.</b>
                            This website is just a tool to help you fill out and download the forms, and is not a substitute for legal advice or official resources. 
                            You will need to submit these forms to the government in order to apply for a name change.
                            This tool offers no guarantees that any generated form is accurate, fit for any purpose, or will be accepted by the court.
                            Always double-check your forms and consult with a lawyer if you have any questions or concerns.
                        </p>
                        <p>
                            By using this tool, you agree that the creator of this website is not liable for any consequences arising from your use of the generated documents.
                        </p>

                    </div>
                </div>
        `}],documents:[{path:"/",name:"ColoradoTest.pdf",btnText:"Download SAMPLE PDF FOR DEMO PURPOSES ONLY",btnIcon:"description",inputFields:["currentFirstName","currentMiddleName","currentLastName","address","city","state","zip","county","dateOfBirth","newFirstName","newMiddleName","newLastName","phone","email"],pdfFields:{old_full_name_1:"text",old_full_name_2:"text",old_full_name_3:"text",old_full_name_4:"text",old_full_name_5:"text",old_full_name_6:"text",old_full_name_7:"text",old_full_name_8:"text",old_full_name_9:"text",old_full_name_10:"text",new_full_name_1:"text",new_full_name_2:"text",new_full_name_3:"text",new_full_name_4:"text",new_full_name_5:"text",new_full_name_6:"text",new_full_name_7:"text",new_full_name_8:"text",county_1:"text",county_2:"text",county_3:"text",county_4:"text",county_5:"text",dob_1:"text",dob_2:"text",narrative:"text"},build:e=>{let n=`${e.currentFirstName} ${e.currentMiddleName} ${e.currentLastName}`,t=`${e.newFirstName} ${e.newMiddleName} ${e.newLastName}`;return{old_full_name_1:n,old_full_name_2:n,old_full_name_3:n,old_full_name_4:n,old_full_name_5:n,old_full_name_6:n,old_full_name_7:n,old_full_name_8:n,new_full_name_1:t,new_full_name_2:t,new_full_name_3:t,new_full_name_4:t,new_full_name_5:t,new_full_name_6:t,new_full_name_7:t,new_full_name_8:t,county_1:e.county,county_2:e.county,county_3:e.county,county_4:e.county,county_5:e.county,dob_1:r(e.dateOfBirth),dob_2:r(e.dateOfBirth),narrative:e.narrative}}}],onload:()=>{document.querySelectorAll("#sexOnBirthRecords, #newSex").forEach(e=>e.addEventListener("change",n=>{const t=document.getElementById("sexOnBirthRecords"),a=document.getElementById("newSex");t.value==="NA"&&(alert("You are seen, however unfortunately, I simply do not know how to generate the correct forms for intersex people. You should should reach out to the Volunteer Lawyers Network for guidance."),t.value=""),a.value==="X"&&(alert("Changing your gender marker to X is a risk-benefit type decision that you should make with the help of an attorney. You can self designate X on an ID, but again this has far reaching implications that I don't have the expertise to advise on. You should should reach out to the Volunteer Lawyers Network for guidance."),a.value=""),t.value===a.value&&t.value!==""&&(alert("This form generator is designed for trans people changing their name AND gender. If you are looking to NOT change your gender, this form may not be the best fit for you. At the bare minimum you will require manually editing the generated PDFs."),t.value="",a.value="")}))},onGenerate:e=>{e.getPages().forEach(t=>{const{width:a,height:o}=t.getSize();t.drawText("DEMO DEMO DEMO DEMO DEMO",{x:5,y:o/2+300,size:50,color:s(.5,.1,.1),rotate:i(-45)})})}};export{d as default};
