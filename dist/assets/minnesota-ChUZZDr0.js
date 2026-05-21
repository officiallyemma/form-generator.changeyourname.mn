function i(e){if(typeof e=="string"){var r=e.split("-");return r.length===3?[r[1],r[2],r[0]].join("-"):e}var t=new Date(e),n=""+(t.getMonth()+1),o=""+t.getDate(),a=t.getFullYear();return n.length<2&&(n="0"+n),o.length<2&&(o="0"+o),[n,o,a].join("-")}let s={name:"mn-form-generator",version:"0.0.0",form:[{type:"comment",html:`
            <div class="card header-card">
                <img src="banner.webp" height="100" alt="Name Change Form Generator" />
                <h1>Minnesota Trans Name Change Court Document Generator</h1>
                <p class="body-text">
                    Easily prefill and download the required legal forms for your name and gender marker change in Minnesota, including forms NAM102, NAM103, and NAM107. Just fill out your information once and it
                    will be applied to all three forms.
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
                    <a href="https://github.com/officiallyemma/form-generator.changeyourname.mn" target="_blank" rel="noopener">open source</a>.
                    </p>
                </div>

                <div class="sub-card sub-card--info">
                    <p>
                    <strong>Prefer to fill out the forms manually?</strong>
                    Try out these interactive PDFs (doesn't work on iOS)
                    See the <a href="https://changeyourname.mn/#prepare-forms" target="_blank">instructions on the main page</a> for guidance in how to fill these out. 

                    <br><br>
                    <md-outlined-button onclick="window.open('/NAM102_Application_for_Name_Change.pdf', '_blank')">
                      <span class="material-symbols-outlined" slot="icon">download</span>
                      Download NAM102
                    </md-outlined-button>
                    <md-outlined-button onclick="window.open('/NAM103_Criminal_History_Check_Release.pdf', '_blank')">
                      <span class="material-symbols-outlined" slot="icon">download</span>
                      Download NAM103
                    </md-outlined-button>
                    <md-outlined-button onclick="window.open('/NAM107_Proposed_Order_Granting_Name_Change.pdf', '_blank')">
                      <span class="material-symbols-outlined" slot="icon">download</span>
                      Download NAM107
                    </md-outlined-button>

                    <p>Otherwise, continue to the form below to generate pre-filled PDFs that you can sign and submit to the court.</p>

            </div>
`},{headerText:"1. Current Legal Name",headerIcon:"person",fields:[{id:"currentFirstName",label:"Current Legal First Name",supportingText:"As shown on official documents",type:"text"},{id:"currentMiddleName",label:"Current Legal Middle Name",supportingText:"Leave blank if none",type:"text"},{id:"currentLastName",label:"Current Legal Last Name",supportingText:"As shown on official documents",type:"text"},{id:"dateOfBirth",label:"Date of Birth",type:"date",supportingText:""},{id:"race",label:"Race",supportingText:"Race for NAM103",type:"text"}]},{headerText:"2. New Legal Name",headerIcon:"badge",fields:[{id:"newFirstName",label:"New First Name",supportingText:"Your chosen first name",type:"text"},{id:"newMiddleName",label:"New Middle Name",supportingText:"Leave blank if none",type:"text"},{id:"newLastName",label:"New Last Name",supportingText:"Your chosen last name",type:"text"}]},{headerText:"3. Sex/Gender Information",headerIcon:"wc",fields:[{id:"sexOnBirthRecords",label:"Assigned Sex at Birth",supportingText:"Your sex as it appears on your birth certificate now",type:"select",options:[{value:"female",label:"Female"},{value:"male",label:"Male"},{value:"NA",label:"Not Listed"}]},{id:"newSex",label:"Amended Sex on Birth Records",supportingText:"Your sex as you want it on your birth certificate",type:"select",options:[{value:"female",label:"Female"},{value:"male",label:"Male"},{value:"X",label:"X"}]}]},{headerText:"4. Contact Information",headerIcon:"contact_mail",fields:[{id:"address",label:"Street Address",supportingText:"Include apartment/unit number",type:"text"},{id:"city",label:"City",type:"text",value:"",supportingText:""},{id:"state",label:"State",type:"text",value:"Minnesota",supportingText:""},{id:"zip",label:"ZIP Code",type:"text",value:"",supportingText:""},{id:"county",label:"County",supportingText:"e.g. Hennepin, Ramsey, Dakota",type:"text"},{id:"phone",label:"Phone Number",supportingText:"Include area code",type:"tel"},{id:"email",label:"Email Address",supportingText:"Court will use this for updates",type:"email"}]},{type:"comment",html:`

                <div class="card">
                    <div class="sub-card sub-card--warning">
                        <h2>Don't Sue Me</h2>
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
        `},{headerText:"5. Legal Signature",headerIcon:"signature",fields:[{id:"legallyBindingSignature",label:"Legally Binding Signature",supportingText:"This may be your new legal name",type:"text"}]},{type:"footer",html:`<div class="footer card">
        <!-- <hr> -->
        <p>
          <i>
            <u>
              Dedicated to
              <b>Sara Millerey González</b>
              , whose life and death calls us to justice.
            </u>
          </i>
          🧱
          <br />
          I'm not a lawyer, and this isn't legal advice. This guide is based on my own experience and research &mdash; double-check everything with
          official sources or get legal help from the
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSe63PCfgMQcY5ZdZBdS4jjJTWzXlIk_dw0N2Dd7N4X0RXFpEA/viewform" target="_blank" rel="noopener"
            >MN Volunteer Lawyer Network</a
          >
          if you need it.
          <a href="https://github.com/qwazwsx/form-generator.changeyourname.mn" target="_blank" rel="noopener"> View source on GitHub </a>
          .
          <br />
          <a href="https://form-generator.changeyourname.mn/" target="_blank" rel="noopener"> Name Change Form Generator </a>
          &copy; 2026 by
          <a href="https://zimbin.ski" target="_blank" rel="noopener">Emma Zimbinski</a>
          is licensed under
          <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GNU GPL 3.0+.</a>
        </p>
      </div>`}],documents:[{path:"/",name:"NAM102_Application_for_Name_Change.pdf",btnText:"Form NAM102 (Application for Name Change)",btnIcon:"description",inputFields:["currentFirstName","currentMiddleName","currentLastName","address","city","state","zip","county","dateOfBirth","newFirstName","newMiddleName","newLastName","newSex","sexOnBirthRecords","legallyBindingSignature","phone","email"],pdfFields:{fullname:"text",address:"text",citystatezip:"text",county:"text",first:"text",middle:"text",last:"text",dob:"text",doSkipSpouse:"checkbox",doSkipChildren:"checkbox",doSkipChildren1:"checkbox",doNameChange:"checkbox",first1:"text",middle1:"text",last1:"text",newfirst:"text",newmiddle:"text",newlast:"text",doBirthRecordChange:"checkbox",newfirst1:"text",newmiddle1:"text",newlast1:"text",doSexChange:"checkbox",newsex:"text",oldsex:"text",doPrivate:"checkbox",doPrivateName:"checkbox",doPrivateSex:"checkbox",hasNoCriminalHistory:"checkbox",hasNoLand:"checkbox",date:"text",fullname1:"text",signature:"text",address1:"text",countyandstate:"text",citystatezip1:"text",phone:"text",email:"text"},build:e=>({fullname:`${e.currentFirstName} ${e.currentMiddleName} ${e.currentLastName}`,address:e.address,citystatezip:`${e.city}, ${e.state} ${e.zip}`,county:e.county,first:e.currentFirstName,middle:e.currentMiddleName,last:e.currentLastName,dob:i(e.dateOfBirth),doSkipSpouse:!0,doSkipChildren:!0,doSkipChildren1:!0,doNameChange:!0,first1:e.currentFirstName,middle1:e.currentMiddleName,last1:e.currentLastName,newfirst:e.newFirstName,newmiddle:e.newMiddleName,newlast:e.newLastName,doBirthRecordChange:!0,newfirst1:e.newFirstName,newmiddle1:e.newMiddleName,newlast1:e.newLastName,doSexChange:!0,newsex:e.newSex,oldsex:e.sexOnBirthRecords,doPrivate:!0,doPrivateName:!0,doPrivateSex:!0,hasNoCriminalHistory:!0,hasNoLand:!0,date:i(new Date),fullname1:`${e.newFirstName} ${e.newMiddleName} ${e.newLastName} (${e.currentFirstName} ${e.currentMiddleName} ${e.currentLastName})`,signature:e.legallyBindingSignature,address1:e.address,countyandstate:`${e.county}, ${e.state}`,citystatezip1:`${e.city}, ${e.state} ${e.zip}`,phone:e.phone,email:e.email})},{path:"/",name:"NAM103_Criminal_History_Check_Release.pdf",btnText:"Form NAM103 (Criminal History Check Release)",btnIcon:"security",inputFields:["currentFirstName","currentMiddleName","currentLastName","newFirstName","newMiddleName","newLastName","dateOfBirth","sexOnBirthRecords","race","legallyBindingSignature"],pdfFields:{name:"text",nickname:"text",dob:"text",isF:"checkbox",isM:"checkbox",race:"text",signature:"text"},build:e=>({name:`${e.currentFirstName} ${e.currentMiddleName} ${e.currentLastName}`,nickname:`${e.newFirstName} ${e.newMiddleName} ${e.newLastName}`,dob:i(e.dateOfBirth),isF:e.sexOnBirthRecords.toLowerCase().indexOf("female")!==-1,isM:e.sexOnBirthRecords.toLowerCase().indexOf("female")===-1,race:e.race,signature:e.legallyBindingSignature})},{path:"/",name:"NAM107_Proposed_Order_Granting_Name_Change.pdf",btnText:"Form NAM107 (Proposed Order Granting Name Change)",btnIcon:"gavel",inputFields:["currentFirstName","currentMiddleName","currentLastName","address","city","state","zip","county","dateOfBirth","newFirstName","newMiddleName","newLastName","newSex"],pdfFields:{name:"text",newName:"text",fullAddress:"text",county:"text",nameAndDob:"text",noSpouse:"checkbox",noChildren:"checkbox",doNameChange:"checkbox",newName1:"text",doBirthRecordChange:"checkbox",newName2:"text",doSexChange:"checkbox",newSex:"text",doConfidential:"checkbox",doConfidentialName:"checkbox",doConfidentialSex:"checkbox"},build:e=>({name:`${e.currentFirstName} ${e.currentMiddleName} ${e.currentLastName}`,newName:`${e.newFirstName} ${e.newMiddleName} ${e.newLastName}`,fullAddress:`${e.address}, ${e.city}, ${e.state} ${e.zip}`,county:e.county,nameAndDob:`${e.currentFirstName} ${e.currentMiddleName} ${e.currentLastName} (${i(e.dateOfBirth)})`,noSpouse:!0,noChildren:!0,doNameChange:!0,newName1:`${e.newFirstName} ${e.newMiddleName} ${e.newLastName}`,doBirthRecordChange:!0,newName2:`${e.newFirstName} ${e.newMiddleName} ${e.newLastName}`,doSexChange:!0,newSex:e.newSex,doConfidential:!0,doConfidentialName:!0,doConfidentialSex:!0})}],onload:()=>{document.querySelector("#state").value="Minnesota",document.querySelectorAll("#sexOnBirthRecords, #newSex").forEach(e=>e.addEventListener("change",r=>{const t=document.getElementById("sexOnBirthRecords"),n=document.getElementById("newSex");t.value==="NA"&&(alert("You are seen, however unfortunately, I simply do not know how to generate the correct forms for intersex people. You should should reach out to the Volunteer Lawyers Network for guidance."),t.value=""),n.value==="X"&&(alert("Changing your gender marker to X is a risk-benefit type decision that you should make with the help of an attorney. You can self designate X on an ID, but again this has far reaching implications that I don't have the expertise to advise on. You should should reach out to the Volunteer Lawyers Network for guidance."),n.value=""),t.value===n.value&&t.value!==""&&(alert("This form generator is designed for trans people changing their name AND gender. If you are looking to NOT change your gender, this form may not be the best fit for you. At the bare minimum you will require manually editing the generated PDFs."),t.value="",n.value="")}))},onGenerate:e=>{}};export{s as default};
