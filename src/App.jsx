import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";

/* ─────────────────────────────────────────
   TRANSLATIONS
───────────────────────────────────────── */
const TR = {
  en: {
    step1:"Personal Data", step2:"Documents", step3:"Sign & Send",
    name:"Full Name", birth:"City & Country of Birth",
    street:"Home Address — Street & Apt No.", city:"City", zip:"ZIP", country:"Country",
    mobile:"Mobile", email:"Email",
    billing:"Billing Info", company:"Company", vat:"VAT",
    bStreet:"Billing Street", bCity:"Billing City", bZip:"Billing ZIP", bEmail:"Billing Email",
    pec:"PEC", sdi:"SDI",
    photosNote:"Add driving licence (front/back) and passport or ID (front/back).",
    privacy:"I acknowledge that Locauto Rent S.p.A., pursuant to Art. 13 EU Reg. 2016/679 (GDPR), will process my personal data in accordance with current regulations and the Privacy Policy available on the website and at the rental desk.",
    sign:"Customer Signature", signNote:"Signature required before sending.",
    signHint:"Sign inside the box", clearSig:"Clear signature",
    contractId:"Contract ID", summary:"Summary",
    send:"Send to Nextfiles", sending:"Sending…", sent:"Email sent ✓",
    newCustomer:"New Customer", next:"Continue →", back:"← Back",
    addDriver:"Add 2nd Driver", removeDriver:"Remove",
    driver:"Driver", missingId:"Please enter Contract ID",
    missingSign:"Collect customer signature first.",
    sendError:"Send failed: ", optional:"optional", lang:"Language",
  },
  it: {
    step1:"Dati Personali", step2:"Documenti", step3:"Firma e Invia",
    name:"Nome e Cognome", birth:"Città e Stato di Nascita",
    street:"Indirizzo di casa — Via e N° Civico", city:"Città", zip:"CAP", country:"Stato",
    mobile:"Cellulare", email:"Email",
    billing:"Fatturazione", company:"Azienda", vat:"Partita IVA",
    bStreet:"Via Fatturazione", bCity:"Città Fatturazione", bZip:"CAP Fatturazione", bEmail:"Email Fatturazione",
    pec:"PEC", sdi:"SDI",
    photosNote:"Aggiungi patente (fronte/retro) e passaporto o carta identità (fronte/retro).",
    privacy:"Prendo atto che Locauto Rent S.p.A., ai sensi dell'art. 13 del Reg. UE 2016/679 (GDPR), tratterà i miei dati personali secondo la normativa vigente e l'informativa Privacy disponibile sul sito e al desk di noleggio.",
    sign:"Firma Cliente", signNote:"La firma è obbligatoria prima di inviare.",
    signHint:"Firma nel riquadro", clearSig:"Cancella firma",
    contractId:"ID Contratto", summary:"Riepilogo",
    send:"Invia a Nextfiles", sending:"Invio…", sent:"Email inviata ✓",
    newCustomer:"Nuovo Cliente", next:"Avanti →", back:"← Indietro",
    addDriver:"Aggiungi 2° Driver", removeDriver:"Rimuovi",
    driver:"Driver", missingId:"Inserisci ID Contratto",
    missingSign:"Fai firmare il cliente prima di procedere.",
    sendError:"Invio fallito: ", optional:"opzionale", lang:"Lingua",
  },
  es: {
    step1:"Datos Personales", step2:"Documentos", step3:"Firma y Envío",
    name:"Nombre y Apellidos", birth:"Ciudad y País de Nacimiento",
    street:"Dirección de casa — Calle y Número", city:"Ciudad", zip:"C.P.", country:"País",
    mobile:"Móvil", email:"Email",
    billing:"Facturación", company:"Empresa", vat:"IVA",
    bStreet:"Calle Facturación", bCity:"Ciudad Facturación", bZip:"C.P. Facturación", bEmail:"Email Facturación",
    pec:"PEC", sdi:"SDI",
    photosNote:"Añade permiso de conducir (anverso/reverso) y DNI o pasaporte.",
    privacy:"Acepto que Locauto Rent S.p.A., según el art. 13 del Reglamento UE 2016/679 (RGPD), procese mis datos personales conforme a la normativa vigente.",
    sign:"Firma del Cliente", signNote:"La firma es obligatoria antes de enviar.",
    signHint:"Firma en el recuadro", clearSig:"Borrar firma",
    contractId:"ID Contrato", summary:"Resumen",
    send:"Enviar a Nextfiles", sending:"Enviando…", sent:"Email enviado ✓",
    newCustomer:"Nuevo Cliente", next:"Siguiente →", back:"← Atrás",
    addDriver:"Añadir 2° Conductor", removeDriver:"Eliminar",
    driver:"Conductor", missingId:"Introduce el ID del contrato",
    missingSign:"Haz que el cliente firme primero.",
    sendError:"Envío fallido: ", optional:"opcional", lang:"Idioma",
  },
  fr: {
    step1:"Données Personnelles", step2:"Documents", step3:"Signature & Envoi",
    name:"Nom et Prénom", birth:"Ville et Pays de Naissance",
    street:"Adresse domicile — Rue et Numéro", city:"Ville", zip:"Code Postal", country:"Pays",
    mobile:"Mobile", email:"Email",
    billing:"Facturation", company:"Société", vat:"TVA",
    bStreet:"Rue Facturation", bCity:"Ville Facturation", bZip:"CP Facturation", bEmail:"Email Facturation",
    pec:"PEC", sdi:"SDI",
    photosNote:"Ajoutez permis de conduire (recto/verso) et passeport ou ID (recto/verso).",
    privacy:"J'accepte que Locauto Rent S.p.A., conformément à l'art. 13 du Règlement UE 2016/679 (RGPD), traite mes données personnelles conformément à la réglementation en vigueur.",
    sign:"Signature Client", signNote:"La signature est obligatoire avant l'envoi.",
    signHint:"Signez dans le cadre", clearSig:"Effacer la signature",
    contractId:"ID Contrat", summary:"Récapitulatif",
    send:"Envoyer à Nextfiles", sending:"Envoi…", sent:"Email envoyé ✓",
    newCustomer:"Nouveau Client", next:"Suivant →", back:"← Retour",
    addDriver:"Ajouter 2e Conducteur", removeDriver:"Supprimer",
    driver:"Conducteur", missingId:"Saisissez l'ID contrat",
    missingSign:"Faites signer le client d'abord.",
    sendError:"Échec de l'envoi: ", optional:"optionnel", lang:"Langue",
  },
  pt: {
    step1:"Dados Pessoais", step2:"Documentos", step3:"Assinar e Enviar",
    name:"Nome e Sobrenome", birth:"Cidade e País de Nascimento",
    street:"Endereço residencial — Rua e Número", city:"Cidade", zip:"CEP", country:"País",
    mobile:"Celular", email:"Email",
    billing:"Faturamento", company:"Empresa", vat:"CNPJ/IVA",
    bStreet:"Rua Faturamento", bCity:"Cidade Faturamento", bZip:"CEP Faturamento", bEmail:"Email Faturamento",
    pec:"PEC", sdi:"SDI",
    photosNote:"Adicione CNH (frente/verso) e passaporte ou RG (frente/verso).",
    privacy:"Aceito que Locauto Rent S.p.A., conforme art. 13 do Regulamento UE 2016/679 (LGPD), processe meus dados pessoais.",
    sign:"Assinatura do Cliente", signNote:"Assinatura obrigatória antes de enviar.",
    signHint:"Assine no quadro", clearSig:"Limpar assinatura",
    contractId:"ID Contrato", summary:"Resumo",
    send:"Enviar para Nextfiles", sending:"Enviando…", sent:"Email enviado ✓",
    newCustomer:"Novo Cliente", next:"Avançar →", back:"← Voltar",
    addDriver:"Adicionar 2° Motorista", removeDriver:"Remover",
    driver:"Motorista", missingId:"Digite o ID do contrato",
    missingSign:"Peça ao cliente para assinar primeiro.",
    sendError:"Falha no envio: ", optional:"opcional", lang:"Idioma",
  },
  zh: {
    step1:"个人资料", step2:"证件", step3:"签名与发送",
    name:"姓名", birth:"出生城市和国家",
    street:"住宅地址（街道和门牌号）", city:"城市", zip:"邮政编码", country:"国家",
    mobile:"手机号码", email:"电子邮箱",
    billing:"开票信息", company:"公司名称", vat:"增值税号",
    bStreet:"账单街道", bCity:"账单城市", bZip:"账单邮编", bEmail:"账单邮箱",
    pec:"PEC", sdi:"SDI",
    photosNote:"请上传驾驶证（正面/背面）和护照或身份证（正面/背面）。",
    privacy:"I acknowledge that Locauto Rent S.p.A., pursuant to Art. 13 EU Reg. 2016/679 (GDPR), will process my personal data in accordance with current regulations and the Privacy Policy available on the website and at the rental desk.",
    sign:"客户签名", signNote:"发送前须先签名。",
    signHint:"请在框内签名", clearSig:"清除签名",
    contractId:"合同编号", summary:"摘要",
    send:"发送至 Nextfiles", sending:"发送中…", sent:"邮件已发送 ✓",
    newCustomer:"新客户", next:"继续 →", back:"← 返回",
    addDriver:"添加第二驾驶员", removeDriver:"删除",
    driver:"驾驶员", missingId:"请输入合同编号",
    missingSign:"请先收集客户签名。",
    sendError:"发送失败：", optional:"可选", lang:"语言",
  },
  ru: {
    step1:"Личные данные", step2:"Документы", step3:"Подпись и отправка",
    name:"Имя и фамилия", birth:"Город и страна рождения",
    street:"Домашний адрес (улица и номер дома)", city:"Город", zip:"Почтовый индекс", country:"Страна",
    mobile:"Мобильный телефон", email:"Email",
    billing:"Платёжные данные", company:"Компания", vat:"ИНН / НДС",
    bStreet:"Улица (счёт)", bCity:"Город (счёт)", bZip:"Индекс (счёт)", bEmail:"Email (счёт)",
    pec:"PEC", sdi:"SDI",
    photosNote:"Добавьте водительское удостоверение (перед/зад) и паспорт или удостоверение личности (перед/зад).",
    privacy:"I acknowledge that Locauto Rent S.p.A., pursuant to Art. 13 EU Reg. 2016/679 (GDPR), will process my personal data in accordance with current regulations and the Privacy Policy available on the website and at the rental desk.",
    sign:"Подпись клиента", signNote:"Подпись обязательна перед отправкой.",
    signHint:"Подпишите в поле", clearSig:"Очистить подпись",
    contractId:"ID договора", summary:"Сводка",
    send:"Отправить в Nextfiles", sending:"Отправка…", sent:"Email отправлен ✓",
    newCustomer:"Новый клиент", next:"Продолжить →", back:"← Назад",
    addDriver:"Добавить 2-го водителя", removeDriver:"Удалить",
    driver:"Водитель", missingId:"Введите ID договора",
    missingSign:"Сначала получите подпись клиента.",
    sendError:"Ошибка отправки: ", optional:"необязательно", lang:"Язык",
  },
};


/* ─────────────────────────────────────────
   ITALIAN — always used for PDF, Step 2 & 3
   regardless of the selected language
───────────────────────────────────────── */
const IT = {
  step2:"Documenti", step3:"Firma e Invia",
  name:"Nome e Cognome", birth:"Città e Stato di Nascita",
  street:"Via e N° Civico / APT", city:"Città", zip:"CAP", country:"Stato",
  mobile:"Cellulare", email:"Email",
  billing:"Fatturazione", company:"Azienda", vat:"Partita IVA",
  bStreet:"Via Fatturazione", bCity:"Città Fatturazione", bZip:"CAP Fatturazione", bEmail:"Email Fatturazione",
  pec:"PEC", sdi:"SDI",
  photosNote:"Aggiungi patente (fronte/retro) e passaporto o carta identità (fronte/retro).",
  privacy:"Prendo atto che Locauto Rent S.p.A., ai sensi dell'art. 13 del Reg. UE 2016/679 (GDPR), tratterà i miei dati personali secondo la normativa vigente e l'informativa Privacy disponibile sul sito e al desk di noleggio.",
  sign:"Firma Cliente", signNote:"La firma è obbligatoria prima di inviare.",
  signHint:"Firma nel riquadro", clearSig:"Cancella firma",
  contractId:"ID Contratto", summary:"Riepilogo",
  send:"Invia a Nextfiles", sending:"Invio…", sent:"Email inviata ✓",
  newCustomer:"Nuovo Cliente", back:"← Indietro",
  driver:"Driver", missingSign:"Fai firmare il cliente prima di procedere.",
  addPhoto:"Aggiungi foto",
};


/* ─────────────────────────────────────────
   COUNTRY DIAL CODES — full list 200+ countries
   used by the searchable PhoneField
───────────────────────────────────────── */
const DIAL_CODES = [
  {flag:"🇦🇫",code:"+93",  name:"Afghanistan"},
  {flag:"🇦🇱",code:"+355", name:"Albania"},
  {flag:"🇩🇿",code:"+213", name:"Algeria"},
  {flag:"🇦🇩",code:"+376", name:"Andorra"},
  {flag:"🇦🇴",code:"+244", name:"Angola"},
  {flag:"🇦🇬",code:"+1",   name:"Antigua and Barbuda"},
  {flag:"🇦🇷",code:"+54",  name:"Argentina"},
  {flag:"🇦🇲",code:"+374", name:"Armenia"},
  {flag:"🇦🇺",code:"+61",  name:"Australia"},
  {flag:"🇦🇹",code:"+43",  name:"Austria"},
  {flag:"🇦🇿",code:"+994", name:"Azerbaijan"},
  {flag:"🇧🇸",code:"+1",   name:"Bahamas"},
  {flag:"🇧🇭",code:"+973", name:"Bahrain"},
  {flag:"🇧🇩",code:"+880", name:"Bangladesh"},
  {flag:"🇧🇧",code:"+1",   name:"Barbados"},
  {flag:"🇧🇾",code:"+375", name:"Belarus"},
  {flag:"🇧🇪",code:"+32",  name:"Belgium"},
  {flag:"🇧🇿",code:"+501", name:"Belize"},
  {flag:"🇧🇯",code:"+229", name:"Benin"},
  {flag:"🇧🇹",code:"+975", name:"Bhutan"},
  {flag:"🇧🇴",code:"+591", name:"Bolivia"},
  {flag:"🇧🇦",code:"+387", name:"Bosnia Herzegovina"},
  {flag:"🇧🇼",code:"+267", name:"Botswana"},
  {flag:"🇧🇷",code:"+55",  name:"Brazil"},
  {flag:"🇧🇳",code:"+673", name:"Brunei"},
  {flag:"🇧🇬",code:"+359", name:"Bulgaria"},
  {flag:"🇧🇫",code:"+226", name:"Burkina Faso"},
  {flag:"🇧🇮",code:"+257", name:"Burundi"},
  {flag:"🇨🇻",code:"+238", name:"Cabo Verde"},
  {flag:"🇰🇭",code:"+855", name:"Cambodia"},
  {flag:"🇨🇲",code:"+237", name:"Cameroon"},
  {flag:"🇨🇦",code:"+1",   name:"Canada"},
  {flag:"🇨🇫",code:"+236", name:"Central African Republic"},
  {flag:"🇹🇩",code:"+235", name:"Chad"},
  {flag:"🇨🇱",code:"+56",  name:"Chile"},
  {flag:"🇨🇳",code:"+86",  name:"China"},
  {flag:"🇨🇴",code:"+57",  name:"Colombia"},
  {flag:"🇰🇲",code:"+269", name:"Comoros"},
  {flag:"🇨🇩",code:"+243", name:"Congo (DRC)"},
  {flag:"🇨🇬",code:"+242", name:"Congo (Republic)"},
  {flag:"🇨🇷",code:"+506", name:"Costa Rica"},
  {flag:"🇭🇷",code:"+385", name:"Croatia"},
  {flag:"🇨🇺",code:"+53",  name:"Cuba"},
  {flag:"🇨🇾",code:"+357", name:"Cyprus"},
  {flag:"🇨🇿",code:"+420", name:"Czech Republic"},
  {flag:"🇩🇰",code:"+45",  name:"Denmark"},
  {flag:"🇩🇯",code:"+253", name:"Djibouti"},
  {flag:"🇩🇴",code:"+1",   name:"Dominican Republic"},
  {flag:"🇪🇨",code:"+593", name:"Ecuador"},
  {flag:"🇪🇬",code:"+20",  name:"Egypt"},
  {flag:"🇸🇻",code:"+503", name:"El Salvador"},
  {flag:"🇬🇶",code:"+240", name:"Equatorial Guinea"},
  {flag:"🇪🇷",code:"+291", name:"Eritrea"},
  {flag:"🇪🇪",code:"+372", name:"Estonia"},
  {flag:"🇸🇿",code:"+268", name:"Eswatini"},
  {flag:"🇪🇹",code:"+251", name:"Ethiopia"},
  {flag:"🇫🇯",code:"+679", name:"Fiji"},
  {flag:"🇫🇮",code:"+358", name:"Finland"},
  {flag:"🇫🇷",code:"+33",  name:"France"},
  {flag:"🇬🇦",code:"+241", name:"Gabon"},
  {flag:"🇬🇲",code:"+220", name:"Gambia"},
  {flag:"🇬🇪",code:"+995", name:"Georgia"},
  {flag:"🇩🇪",code:"+49",  name:"Germany"},
  {flag:"🇬🇭",code:"+233", name:"Ghana"},
  {flag:"🇬🇷",code:"+30",  name:"Greece"},
  {flag:"🇬🇹",code:"+502", name:"Guatemala"},
  {flag:"🇬🇳",code:"+224", name:"Guinea"},
  {flag:"🇬🇼",code:"+245", name:"Guinea-Bissau"},
  {flag:"🇬🇾",code:"+592", name:"Guyana"},
  {flag:"🇭🇹",code:"+509", name:"Haiti"},
  {flag:"🇭🇳",code:"+504", name:"Honduras"},
  {flag:"🇭🇺",code:"+36",  name:"Hungary"},
  {flag:"🇮🇸",code:"+354", name:"Iceland"},
  {flag:"🇮🇳",code:"+91",  name:"India"},
  {flag:"🇮🇩",code:"+62",  name:"Indonesia"},
  {flag:"🇮🇷",code:"+98",  name:"Iran"},
  {flag:"🇮🇶",code:"+964", name:"Iraq"},
  {flag:"🇮🇪",code:"+353", name:"Ireland"},
  {flag:"🇮🇱",code:"+972", name:"Israel"},
  {flag:"🇮🇹",code:"+39",  name:"Italy"},
  {flag:"🇯🇲",code:"+1",   name:"Jamaica"},
  {flag:"🇯🇵",code:"+81",  name:"Japan"},
  {flag:"🇯🇴",code:"+962", name:"Jordan"},
  {flag:"🇰🇿",code:"+7",   name:"Kazakhstan"},
  {flag:"🇰🇪",code:"+254", name:"Kenya"},
  {flag:"🇰🇼",code:"+965", name:"Kuwait"},
  {flag:"🇰🇬",code:"+996", name:"Kyrgyzstan"},
  {flag:"🇱🇦",code:"+856", name:"Laos"},
  {flag:"🇱🇻",code:"+371", name:"Latvia"},
  {flag:"🇱🇧",code:"+961", name:"Lebanon"},
  {flag:"🇱🇸",code:"+266", name:"Lesotho"},
  {flag:"🇱🇷",code:"+231", name:"Liberia"},
  {flag:"🇱🇾",code:"+218", name:"Libya"},
  {flag:"🇱🇮",code:"+423", name:"Liechtenstein"},
  {flag:"🇱🇹",code:"+370", name:"Lithuania"},
  {flag:"🇱🇺",code:"+352", name:"Luxembourg"},
  {flag:"🇲🇬",code:"+261", name:"Madagascar"},
  {flag:"🇲🇼",code:"+265", name:"Malawi"},
  {flag:"🇲🇾",code:"+60",  name:"Malaysia"},
  {flag:"🇲🇻",code:"+960", name:"Maldives"},
  {flag:"🇲🇱",code:"+223", name:"Mali"},
  {flag:"🇲🇹",code:"+356", name:"Malta"},
  {flag:"🇲🇷",code:"+222", name:"Mauritania"},
  {flag:"🇲🇺",code:"+230", name:"Mauritius"},
  {flag:"🇲🇽",code:"+52",  name:"Mexico"},
  {flag:"🇲🇩",code:"+373", name:"Moldova"},
  {flag:"🇲🇨",code:"+377", name:"Monaco"},
  {flag:"🇲🇳",code:"+976", name:"Mongolia"},
  {flag:"🇲🇪",code:"+382", name:"Montenegro"},
  {flag:"🇲🇦",code:"+212", name:"Morocco"},
  {flag:"🇲🇿",code:"+258", name:"Mozambique"},
  {flag:"🇲🇲",code:"+95",  name:"Myanmar"},
  {flag:"🇳🇦",code:"+264", name:"Namibia"},
  {flag:"🇳🇵",code:"+977", name:"Nepal"},
  {flag:"🇳🇱",code:"+31",  name:"Netherlands"},
  {flag:"🇳🇿",code:"+64",  name:"New Zealand"},
  {flag:"🇳🇮",code:"+505", name:"Nicaragua"},
  {flag:"🇳🇪",code:"+227", name:"Niger"},
  {flag:"🇳🇬",code:"+234", name:"Nigeria"},
  {flag:"🇲🇰",code:"+389", name:"North Macedonia"},
  {flag:"🇳🇴",code:"+47",  name:"Norway"},
  {flag:"🇴🇲",code:"+968", name:"Oman"},
  {flag:"🇵🇰",code:"+92",  name:"Pakistan"},
  {flag:"🇵🇦",code:"+507", name:"Panama"},
  {flag:"🇵🇬",code:"+675", name:"Papua New Guinea"},
  {flag:"🇵🇾",code:"+595", name:"Paraguay"},
  {flag:"🇵🇪",code:"+51",  name:"Peru"},
  {flag:"🇵🇭",code:"+63",  name:"Philippines"},
  {flag:"🇵🇱",code:"+48",  name:"Poland"},
  {flag:"🇵🇹",code:"+351", name:"Portugal"},
  {flag:"🇶🇦",code:"+974", name:"Qatar"},
  {flag:"🇷🇴",code:"+40",  name:"Romania"},
  {flag:"🇷🇺",code:"+7",   name:"Russia"},
  {flag:"🇷🇼",code:"+250", name:"Rwanda"},
  {flag:"🇸🇦",code:"+966", name:"Saudi Arabia"},
  {flag:"🇸🇳",code:"+221", name:"Senegal"},
  {flag:"🇷🇸",code:"+381", name:"Serbia"},
  {flag:"🇸🇱",code:"+232", name:"Sierra Leone"},
  {flag:"🇸🇬",code:"+65",  name:"Singapore"},
  {flag:"🇸🇰",code:"+421", name:"Slovakia"},
  {flag:"🇸🇮",code:"+386", name:"Slovenia"},
  {flag:"🇸🇴",code:"+252", name:"Somalia"},
  {flag:"🇿🇦",code:"+27",  name:"South Africa"},
  {flag:"🇰🇷",code:"+82",  name:"South Korea"},
  {flag:"🇸🇸",code:"+211", name:"South Sudan"},
  {flag:"🇪🇸",code:"+34",  name:"Spain"},
  {flag:"🇱🇰",code:"+94",  name:"Sri Lanka"},
  {flag:"🇸🇩",code:"+249", name:"Sudan"},
  {flag:"🇸🇷",code:"+597", name:"Suriname"},
  {flag:"🇸🇪",code:"+46",  name:"Sweden"},
  {flag:"🇨🇭",code:"+41",  name:"Switzerland"},
  {flag:"🇸🇾",code:"+963", name:"Syria"},
  {flag:"🇹🇼",code:"+886", name:"Taiwan"},
  {flag:"🇹🇯",code:"+992", name:"Tajikistan"},
  {flag:"🇹🇿",code:"+255", name:"Tanzania"},
  {flag:"🇹🇭",code:"+66",  name:"Thailand"},
  {flag:"🇹🇱",code:"+670", name:"Timor-Leste"},
  {flag:"🇹🇬",code:"+228", name:"Togo"},
  {flag:"🇹🇹",code:"+1",   name:"Trinidad and Tobago"},
  {flag:"🇹🇳",code:"+216", name:"Tunisia"},
  {flag:"🇹🇷",code:"+90",  name:"Turkey"},
  {flag:"🇹🇲",code:"+993", name:"Turkmenistan"},
  {flag:"🇺🇬",code:"+256", name:"Uganda"},
  {flag:"🇺🇦",code:"+380", name:"Ukraine"},
  {flag:"🇦🇪",code:"+971", name:"UAE"},
  {flag:"🇬🇧",code:"+44",  name:"United Kingdom"},
  {flag:"🇺🇸",code:"+1",   name:"USA"},
  {flag:"🇺🇾",code:"+598", name:"Uruguay"},
  {flag:"🇺🇿",code:"+998", name:"Uzbekistan"},
  {flag:"🇻🇪",code:"+58",  name:"Venezuela"},
  {flag:"🇻🇳",code:"+84",  name:"Vietnam"},
  {flag:"🇾🇪",code:"+967", name:"Yemen"},
  {flag:"🇿🇲",code:"+260", name:"Zambia"},
  {flag:"🇿🇼",code:"+263", name:"Zimbabwe"},
];

const emptyDriver = { name:"", birth:"", street:"", city:"", zip:"", country:"", mobile:"", email:"" };
const emptyBill   = { company:"", vat:"", bStreet:"", bCity:"", bZip:"", bEmail:"", pec:"", sdi:"" };

const C = {
  blue:"#0794c8", blueDk:"#0570a0", blueLt:"#e8f5fb",
  green:"#00a651", greenDk:"#007a3d",
  white:"#ffffff", bg:"#f2f8fc", card:"#ffffff",
  border:"#c8e4f4", text:"#1a2a38", muted:"#6b8fa8",
  red:"#d93025", redLt:"#fef2f2",
};

/* ─────────────────────────────────────────
   CSS
───────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Nunito+Sans:wght@400;600;700&display=swap');
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;margin:0;padding:0;}
html,body,#root{min-height:100%;}
body{background:${C.bg};color:${C.text};font-family:'Nunito Sans',sans-serif;font-size:15px;overscroll-behavior:none;}
body.signing{overflow:hidden;touch-action:none;}
input,select,button{font-family:'Nunito Sans',sans-serif;}
input::placeholder{color:#a0bdd0;}
select option{background:#fff;color:${C.text};}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px;}
.app{max-width:520px;margin:0 auto;padding-bottom:90px;}
.hero{display:flex;height:130px;overflow:hidden;}
.hero-left{background:#0794c8;flex:0 0 48%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:14px 10px;border-right:3px solid rgba(255,255,255,.2);}
.hero-elephant{font-size:30px;line-height:1;margin-bottom:2px;}
.hero-locauto{font-family:'Nunito',sans-serif;font-size:21px;font-weight:900;color:#fff;letter-spacing:.04em;line-height:1;}
.hero-tagline{font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-top:3px;}
.hero-right{flex:1;background:linear-gradient(155deg,#3dbfb0 0%,#00a651 50%,#007a3d 100%);display:flex;flex-direction:column;align-items:stretch;justify-content:center;gap:5px;padding:10px 11px;position:relative;overflow:hidden;}
.hero-right::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(-18deg,transparent,transparent 18px,rgba(0,0,0,.08) 18px,rgba(0,0,0,.08) 22px);pointer-events:none;}
.brand-pill{border-radius:5px;padding:4px 9px;font-family:'Nunito',sans-serif;font-weight:900;font-size:12px;letter-spacing:.02em;position:relative;z-index:1;display:flex;align-items:center;gap:5px;}
.brand-national{background:#1a5f3f;color:#fff;border:1.5px solid rgba(255,255,255,.25);}
.brand-enterprise{background:#006b3f;color:#fff;border:1.5px solid rgba(255,255,255,.15);}
.brand-alamo{background:#003882;color:#f5c500;border:1.5px solid rgba(245,197,0,.35);}
.hero-bar{background:#1a2a38;padding:9px 16px;display:flex;align-items:center;justify-content:space-between;}
.hero-bar-title{font-family:'Nunito',sans-serif;font-size:15px;font-weight:900;color:#fff;}
.hero-bar-sub{font-size:11px;color:rgba(255,255,255,.45);font-weight:600;}
.lang-bar{background:#fff;border-bottom:2px solid ${C.border};padding:10px 16px;display:flex;align-items:center;gap:10px;}
.lang-bar label{font-size:11px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:${C.muted};white-space:nowrap;}
.lang-bar select{flex:1;background:#f2f8fc;border:1.5px solid ${C.border};border-radius:8px;color:${C.text};font-size:14px;font-weight:700;padding:8px 12px;outline:none;}
.step-bar{display:flex;background:#fff;border-bottom:2px solid ${C.border};position:sticky;top:0;z-index:20;}
.step{flex:1;padding:12px 4px;text-align:center;font-family:'Nunito',sans-serif;font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:${C.muted};border-right:1px solid ${C.border};position:relative;cursor:default;transition:color .2s;}
.step:last-child{border-right:0;}
.step.active{color:${C.blue};}
.step.active::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:${C.blue};border-radius:2px 2px 0 0;}
.step.done{color:${C.green};cursor:pointer;}
.step-num{display:inline-flex;width:18px;height:18px;border-radius:50%;background:#dde8f0;align-items:center;justify-content:center;font-size:10px;font-weight:900;margin-right:4px;transition:all .2s;}
.active .step-num{background:${C.blue};color:#fff;}
.done .step-num{background:${C.green};color:#fff;}
.body{padding:16px 14px 0;}
.card{background:${C.card};border:1.5px solid ${C.border};border-radius:16px;overflow:hidden;margin-bottom:14px;box-shadow:0 2px 12px rgba(7,148,200,.07);}
.card-head{padding:12px 16px;border-bottom:1.5px solid ${C.border};display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,${C.blueLt},#fff);}
.card-title{font-family:'Nunito',sans-serif;font-size:12px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:${C.blue};display:flex;align-items:center;gap:7px;}
.card-title .ico{font-size:15px;}
.card-body{padding:16px;}
.field{margin-bottom:12px;}
.field label{display:block;font-size:11px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:${C.muted};margin-bottom:5px;}
.field input,.field select{width:100%;padding:13px 14px;background:#f8fcff;border:1.5px solid ${C.border};border-radius:10px;color:${C.text};font-family:'Nunito Sans',sans-serif;font-size:15px;font-weight:600;outline:none;transition:border-color .2s,box-shadow .2s;}
.field input:focus,.field select:focus{border-color:${C.blue};box-shadow:0 0 0 3px rgba(7,148,200,.14);}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.tog{display:flex;align-items:center;gap:10px;cursor:pointer;padding:6px 0;}
.tog-track{width:42px;height:24px;background:#d0dde8;border-radius:99px;position:relative;flex-shrink:0;transition:background .2s;}
.tog-track.on{background:${C.blue};}
.tog-track::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.2);}
.tog-track.on::after{transform:translateX(18px);}
.tog-label{font-size:14px;font-weight:700;color:${C.text};}
.photo-add{display:flex;align-items:center;justify-content:center;gap:8px;padding:16px;border:2px dashed ${C.border};border-radius:12px;cursor:pointer;color:${C.muted};font-weight:700;font-size:14px;transition:border-color .2s,color .2s;margin-bottom:12px;}
.photo-add:hover{border-color:${C.blue};color:${C.blue};}
.photos{display:flex;flex-wrap:wrap;gap:10px;}
.thumb{position:relative;width:84px;height:84px;border-radius:10px;overflow:hidden;border:1.5px solid ${C.border};flex-shrink:0;}
.thumb img{width:100%;height:100%;object-fit:cover;}
.thumb-del{position:absolute;top:4px;right:4px;width:22px;height:22px;border-radius:50%;background:rgba(217,48,37,.88);border:0;color:#fff;font-weight:900;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;}
.sig-outer{position:relative;border-radius:10px;overflow:hidden;border:2px solid ${C.border};transition:border-color .3s;background:#fff;}
.sig-outer.signed{border-color:${C.green};}
.sig-canvas{display:block;cursor:crosshair;touch-action:none;background:#fff;border-radius:8px;}
.sig-hint{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;color:#b0c8d8;font-size:13px;font-weight:700;display:flex;flex-direction:column;align-items:center;gap:5px;text-align:center;white-space:nowrap;}
.sig-hint .ico{font-size:28px;opacity:.45;}
.privacy-box{background:${C.blueLt};border:1.5px solid ${C.border};border-radius:10px;padding:14px;font-size:12px;line-height:1.55;color:${C.muted};}
.id-input{font-size:32px!important;text-align:center!important;font-weight:900!important;letter-spacing:.08em!important;color:${C.blue}!important;padding:20px!important;}
.sum-row{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:9px 0;border-bottom:1.5px solid ${C.blueLt};font-size:13px;}
.sum-row:last-child{border-bottom:0;}
.sum-k{color:${C.muted};font-weight:700;flex-shrink:0;}
.sum-v{color:${C.text};font-weight:800;text-align:right;word-break:break-word;}
.btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:15px;border-radius:12px;border:none;font-family:'Nunito',sans-serif;font-size:16px;font-weight:900;letter-spacing:.03em;cursor:pointer;transition:opacity .15s,transform .1s;}
.btn:active{transform:scale(.97);}
.btn:disabled{opacity:.45;cursor:not-allowed;}
.btn-primary{background:${C.blue};color:#fff;box-shadow:0 4px 16px rgba(7,148,200,.30);}
.btn-success{background:${C.green};color:#fff;box-shadow:0 4px 16px rgba(0,166,81,.25);}
.btn-ghost{background:#fff;color:${C.blue};border:2px solid ${C.border};}
.btn-danger{background:${C.redLt};color:${C.red};border:1.5px solid #fca5a5;}
.btn-soft{background:${C.blueLt};color:${C.blue};border:1.5px solid ${C.border};}
.btn-sm{font-size:13px!important;padding:9px 14px!important;width:auto!important;border-radius:9px!important;}
.nav{display:flex;gap:10px;}
.nav .btn{flex:1;}
.note{font-size:12px;color:${C.muted};line-height:1.45;}
.note.warn{color:${C.red};font-weight:800;}
.gap{height:12px;}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:${C.green};color:#fff;font-family:'Nunito',sans-serif;font-weight:800;font-size:15px;padding:14px 28px;border-radius:14px;box-shadow:0 8px 30px rgba(0,166,81,.4);z-index:999;white-space:nowrap;animation:slidein .3s ease;}
@keyframes slidein{from{opacity:0;transform:translateX(-50%) translateY(16px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
@media(max-width:480px){.grid2{grid-template-columns:1fr!important;}.hero-title{font-size:22px;}.step{font-size:10px;}}
`;

/* ─────────────────────────────────────────
   SIGNATURE CANVAS  — forwardRef component
   This is the correct pattern: the canvas
   lives in its own component so refs and
   effects are stable across renders.
───────────────────────────────────────── */
const SignatureCanvas = forwardRef(function SignatureCanvas({ onMark }, ref) {
  const canvasRef = useRef(null);
  const drawing   = useRef(false);
  const lastXY    = useRef([0, 0]);
  const marked    = useRef(false);

  /* Expose clear() and getDataURL() to parent via ref */
  useImperativeHandle(ref, () => ({
    clear() {
      const c = canvasRef.current; if (!c) return;
      c.getContext("2d").clearRect(0, 0, c.width, c.height);
      marked.current = false;
      onMark(false);
    },
    getDataURL() {
      return canvasRef.current ? canvasRef.current.toDataURL("image/png") : null;
    },
  }));

  /* Set canvas resolution once after mount, and on resize */
  function sizeCanvas() {
    const c = canvasRef.current; if (!c) return;
    const dpr  = window.devicePixelRatio || 1;
    const rect = c.parentElement.getBoundingClientRect();
    const w    = Math.max(rect.width || 300, 200);
    const h    = 200;
    /* Preserve existing drawing */
    let imgData = null;
    try { imgData = c.getContext("2d").getImageData(0, 0, c.width, c.height); } catch(e){}
    c.width  = w * dpr;
    c.height = h * dpr;
    c.style.width  = w + "px";
    c.style.height = h + "px";
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    if (imgData) ctx.putImageData(imgData, 0, 0);
  }

  useEffect(() => {
    sizeCanvas();
    const ro = new ResizeObserver(sizeCanvas);
    if (canvasRef.current?.parentElement) ro.observe(canvasRef.current.parentElement);
    return () => ro.disconnect();
  }, []);

  function getXY(e) {
    const c = canvasRef.current;
    const r = c.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return [src.clientX - r.left, src.clientY - r.top];
  }

  function pointerDown(e) {
    e.preventDefault();
    drawing.current = true;
    lastXY.current  = getXY(e);
    document.body.classList.add("signing");
  }

  function pointerMove(e) {
    e.preventDefault();
    if (!drawing.current) return;
    const c   = canvasRef.current;
    const ctx = c.getContext("2d");
    const [x, y] = getXY(e);
    const [lx, ly] = lastXY.current;

    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#1a2a38";
    ctx.lineWidth   = 2.2;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
    ctx.stroke();

    lastXY.current = [x, y];
    if (!marked.current) { marked.current = true; onMark(true); }
  }

  function pointerUp() {
    drawing.current = false;
    document.body.classList.remove("signing");
  }

  return (
    <canvas
      ref={canvasRef}
      className="sig-canvas"
      style={{ width: "100%", height: 200 }}
      onMouseDown={pointerDown}
      onMouseMove={pointerMove}
      onMouseUp={pointerUp}
      onMouseLeave={pointerUp}
      onTouchStart={pointerDown}
      onTouchMove={pointerMove}
      onTouchEnd={pointerUp}
    />
  );
});

/* ─────────────────────────────────────────
   SMALL UI COMPONENTS
───────────────────────────────────────── */

/* Maps UI language → default dial code */
const LANG_TO_DIAL = {
  it:"+39", en:"", es:"+34", fr:"+33", pt:"+351", zh:"+86", ru:"+7",
};

/* Maps common country name spellings (lowercase) → dial code */
const COUNTRY_TO_DIAL = {
  "italy":"+39","italia":"+39","italie":"+39","italien":"+39",
  "uk":"+44","united kingdom":"+44","great britain":"+44","regno unito":"+44",
  "usa":"+1","united states":"+1","canada":"+1","stati uniti":"+1",
  "germany":"+49","germania":"+49","deutschland":"+49","allemagne":"+49","alemania":"+49",
  "france":"+33","francia":"+33","frankreich":"+33",
  "spain":"+34","spagna":"+34","españa":"+34","espagne":"+34",
  "portugal":"+351","portogallo":"+351",
  "brazil":"+55","brasile":"+55","brasil":"+55",
  "china":"+86","cina":"+86","chine":"+86","中国":"+86",
  "russia":"+7","russie":"+7","россия":"+7",
  "japan":"+81","giappone":"+81","japon":"+81",
  "south korea":"+82","corea del sud":"+82",
  "india":"+91","inde":"+91",
  "australia":"+61","australie":"+61",
  "switzerland":"+41","svizzera":"+41","suisse":"+41","schweiz":"+41",
  "austria":"+43","österreich":"+43",
  "belgium":"+32","belgio":"+32","belgique":"+32",
  "netherlands":"+31","olanda":"+31","pays-bas":"+31","nederland":"+31",
  "poland":"+48","polonia":"+48","pologne":"+48",
  "sweden":"+46","svezia":"+46","suède":"+46",
  "norway":"+47","norvegia":"+47","norvège":"+47",
  "denmark":"+45","danimarca":"+45","danemark":"+45",
  "finland":"+358","finlandia":"+358","finlande":"+358",
  "czech republic":"+420","czechia":"+420","cechia":"+420",
  "hungary":"+36","ungheria":"+36","hongrie":"+36",
  "romania":"+40","rumania":"+40",
  "turkey":"+90","turchia":"+90","turquie":"+90","türkiye":"+90",
  "israel":"+972","israele":"+972",
  "uae":"+971","united arab emirates":"+971","emirati arabi uniti":"+971",
  "saudi arabia":"+966","arabia saudita":"+966",
  "mexico":"+52","messico":"+52","méxico":"+52",
  "argentina":"+54",
  "south africa":"+27","sudafrica":"+27",
  "greece":"+30","grecia":"+30","grèce":"+30",
  "croatia":"+385","croazia":"+385",
  "ireland":"+353","irlanda":"+353","irlande":"+353",
  "iceland":"+354","islanda":"+354","islande":"+354",
  "ukraine":"+380","ucraina":"+380","ukraine":"+380",
  "georgia":"+995","georgia":"+995",
};

/* ─────────────────────────────────────────
   PHONE FIELD — searchable country picker
   Booking.com / Airbnb style
───────────────────────────────────────── */
function PhoneField({ value, onChange, label, lang, countryVal }) {
  const [open,    setOpen]    = useState(false);
  const [search,  setSearch]  = useState("");
  const [dialCode, setDialCode] = useState("");  // "" = nothing chosen yet
  const [num,     setNum]     = useState("");
  const manualDial = useRef(false);
  const searchRef  = useRef(null);
  const wrapRef    = useRef(null);

  // Parse an incoming value string like "+39 333 000" into code + number
  useEffect(() => {
    if (!value) return;
    const found = DIAL_CODES.find(d => value.startsWith(d.code + " ") || value === d.code);
    if (found) { setDialCode(found.code); setNum(value.slice(found.code.length).replace(/^ /, "")); }
    else setNum(value);
  }, []);

  // Auto-follow language when nothing chosen yet
  useEffect(() => {
    if (manualDial.current || num) return;
    const def = LANG_TO_DIAL[lang];
    if (def) setDialCode(def);
  }, [lang]);

  // Auto-detect from country field
  useEffect(() => {
    if (manualDial.current || num || !countryVal) return;
    const cv = countryVal.toLowerCase().trim();
    const match = COUNTRY_TO_DIAL[cv];
    if (match) setDialCode(match);
  }, [countryVal]);

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handle);
    document.addEventListener("touchstart", handle);
    return () => { document.removeEventListener("mousedown", handle); document.removeEventListener("touchstart", handle); };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => { if (open && searchRef.current) searchRef.current.focus(); }, [open]);

  const filtered = search.trim()
    ? DIAL_CODES.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.code.includes(search))
    : DIAL_CODES;

  const selected = DIAL_CODES.find(d => d.code === dialCode);

  function pick(d) {
    manualDial.current = true;
    setDialCode(d.code);
    setSearch("");
    setOpen(false);
    onChange(d.code + (num ? " " + num : ""));
  }

  function handleNum(e) {
    const n = e.target.value.replace(/[^\d\s\-]/g, "");
    setNum(n);
    onChange((dialCode || "") + (n ? " " + n : ""));
  }

  const notChosen = !dialCode;

  return (
    <div className="field" ref={wrapRef} style={{position:"relative"}}>
      <label>{label}</label>
      <div style={{display:"flex", gap:8}}>

        {/* ── Country picker button ── */}
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          style={{
            flexShrink:0, display:"flex", alignItems:"center", gap:6,
            padding:"13px 12px",
            background: notChosen ? "#fff8e8" : "#f8fcff",
            border: `1.5px solid ${notChosen ? "#f5c500" : "#c8e4f4"}`,
            borderRadius:10, cursor:"pointer",
            fontFamily:"'Nunito Sans',sans-serif", fontSize:15, fontWeight:700,
            color: notChosen ? "#b07000" : "#1a2a38",
            minWidth:110, justifyContent:"space-between",
            transition:"border-color .2s",
          }}
        >
          <span style={{fontSize:18}}>{selected ? selected.flag : "🌍"}</span>
          <span style={{fontSize:13}}>{selected ? selected.code : "Select"}</span>
          <span style={{fontSize:10, color:"#6b8fa8"}}>▼</span>
        </button>

        {/* ── Number input ── */}
        <input
          type="tel" inputMode="tel"
          value={num}
          onChange={handleNum}
          placeholder="333 000 0000"
          style={{
            flex:1, padding:"13px 14px",
            background:"#f8fcff", border:"1.5px solid #c8e4f4",
            borderRadius:10, color:"#1a2a38",
            fontFamily:"'Nunito Sans',sans-serif", fontSize:15, fontWeight:600,
            outline:"none",
          }}
        />
      </div>

      {/* hint when nothing selected */}
      {notChosen && (
        <div style={{marginTop:5, fontSize:11, color:"#b07000", fontWeight:700}}>
          👆 Tap the globe to select your country code
        </div>
      )}

      {/* ── Dropdown ── */}
      {open && (
        <div style={{
          position:"absolute", zIndex:999,
          background:"#fff", border:"1.5px solid #c8e4f4",
          borderRadius:12, boxShadow:"0 8px 32px rgba(7,148,200,.18)",
          width:"min(320px, 90vw)", marginTop:4,
          overflow:"hidden",
        }}>
          {/* Search box */}
          <div style={{padding:"10px 12px", borderBottom:"1px solid #e8f5fb"}}>
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍  Search country…"
              style={{
                width:"100%", padding:"10px 12px",
                background:"#f2f8fc", border:"1.5px solid #c8e4f4",
                borderRadius:8, fontSize:14, fontWeight:600,
                color:"#1a2a38", outline:"none",
                fontFamily:"'Nunito Sans',sans-serif",
              }}
            />
          </div>
          {/* Country list */}
          <div style={{maxHeight:240, overflowY:"auto"}}>
            {filtered.length === 0 && (
              <div style={{padding:"16px", textAlign:"center", color:"#6b8fa8", fontSize:13}}>No results</div>
            )}
            {filtered.map(d => (
              <div
                key={d.name}
                onClick={() => pick(d)}
                style={{
                  display:"flex", alignItems:"center", gap:10,
                  padding:"11px 14px", cursor:"pointer",
                  background: dialCode === d.code ? "#e8f5fb" : "transparent",
                  borderBottom:"1px solid #f2f8fc",
                  fontSize:14, fontWeight:600, color:"#1a2a38",
                  transition:"background .1s",
                }}
                onMouseEnter={e => e.currentTarget.style.background="#f2f8fc"}
                onMouseLeave={e => e.currentTarget.style.background = dialCode===d.code ? "#e8f5fb" : "transparent"}
              >
                <span style={{fontSize:20}}>{d.flag}</span>
                <span style={{flex:1}}>{d.name}</span>
                <span style={{color:"#0794c8", fontWeight:800, fontSize:13}}>{d.code}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


function Field({ label, children }) {
  return <div className="field"><label>{label}</label>{children}</div>;
}

function FInput({ value, onChange, placeholder = "", inputMode, className = "" }) {
  return (
    <input value={value} onChange={onChange}
      placeholder={placeholder} inputMode={inputMode} className={className}/>
  );
}

function Card({ icon, title, right, children }) {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title"><span className="ico">{icon}</span>{title}</div>
        {right}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", disabled = false, small = false, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`btn btn-${variant}${small ? " btn-sm" : ""}`} style={style}>
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────
   PDF  (canvas-based, no jsPDF)
───────────────────────────────────────── */
async function buildPdfBase64(drivers, showBill, bill, contractId, sigDataURL, t) {
  const W = 794, H = 1123;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");

  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#0794c8"; ctx.fillRect(0, 0, W, 68);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px Arial";
  ctx.fillText("LOCAUTO RENT — CUSTOMER DATA", 36, 44);
  if (contractId) {
    ctx.font = "bold 13px Arial"; ctx.textAlign = "right";
    ctx.fillText("Contract: " + contractId, W - 36, 44);
    ctx.textAlign = "left";
  }

  let y = 100;
  const L = 40, R = 420, lh = 30;

  function lbl(text, x, cy) {
    ctx.font = "bold 10px Arial"; ctx.fillStyle = "#6b8fa8";
    ctx.fillText(text.toUpperCase(), x, cy);
  }
  function val(text, x, cy, maxW) {
    ctx.font = "600 13px Arial"; ctx.fillStyle = "#1a2a38";
    const words = (text || "—").split(" "); let line = "";
    let drawn = 0;
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, cy + 16 + drawn * 15); line = w; drawn++;
      } else line = test;
    }
    ctx.fillText(line, x, cy + 16 + drawn * 15);
    return drawn + 1;
  }
  function hr(cy) {
    ctx.strokeStyle = "#c8e4f4"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(L, cy); ctx.lineTo(W - L, cy); ctx.stroke();
  }
  function secTitle(text, cy) {
    ctx.fillStyle = "#0794c8"; ctx.font = "bold 11px Arial";
    ctx.fillText("▸ " + text.toUpperCase(), L, cy); return cy + 20;
  }

  drivers.forEach((d, di) => {
    if (drivers.length > 1) { y = secTitle(t.driver + " " + (di+1), y); }
    const pairs = [
      [t.name, d.name, null, null],
      [t.birth, d.birth, null, null],
      [t.street, d.street, null, null],
      [t.city, d.city, t.zip, d.zip],
      [t.country, d.country, t.mobile, d.mobile],
      [t.email, d.email, null, null],
    ];
    for (const [k1,v1,k2,v2] of pairs) {
      if (y > H - 200) break;
      lbl(k1, L, y); val(v1, L, y, k2 ? 360 : 720);
      if (k2) { lbl(k2, R, y); val(v2, R, y, 320); }
      y += lh; hr(y - 4);
    }
    y += 12;
  });

  if (showBill && bill.company) {
    y = secTitle(t.billing, y);
    [[t.company,bill.company,t.vat,bill.vat],[t.bStreet,bill.bStreet,t.bCity,bill.bCity],
     [t.bZip,bill.bZip,t.bEmail,bill.bEmail],["PEC",bill.pec,"SDI",bill.sdi]].forEach(([k1,v1,k2,v2])=>{
      if(y>H-200)return; lbl(k1,L,y); val(v1,L,y,360);
      if(k2){lbl(k2,R,y);val(v2,R,y,320);}
      y+=lh; hr(y-4);
    });
    y += 12;
  }

  // privacy text
  if (y < H - 230) {
    ctx.font = "10px Arial"; ctx.fillStyle = "#6b8fa8";
    const words = t.privacy.split(" "); let line = "";
    for (const w of words) {
      const test = line ? line+" "+w : w;
      if (ctx.measureText(test).width > W-80 && line) { ctx.fillText(line, L, y); y+=14; line=w; }
      else line = test;
    }
    ctx.fillText(line, L, y); y += 24;
  }

  // signature box
  const sy = Math.max(y + 10, H - 170);
  ctx.fillStyle = "#f2f8fc"; ctx.fillRect(L, sy, W-80, 110);
  ctx.strokeStyle = "#c8e4f4"; ctx.lineWidth = 1.5;
  ctx.strokeRect(L, sy, W-80, 110);
  ctx.font = "bold 10px Arial"; ctx.fillStyle = "#6b8fa8";
  ctx.fillText("FIRMA / SIGNATURE", L+10, sy+18);
  ctx.fillText("Data: " + new Date().toLocaleDateString("it-IT"), L+10, sy+100);

  if (sigDataURL) {
    await new Promise(res => {
      const img = new Image(); img.onload = () => { ctx.drawImage(img, L+20, sy+24, 340, 68); res(); };
      img.src = sigDataURL;
    });
  }

  ctx.fillStyle = "#0794c8"; ctx.fillRect(0, H-28, W, 28);
  ctx.font = "bold 10px Arial"; ctx.fillStyle = "#fff"; ctx.textAlign = "center";
  ctx.fillText("Locauto Rent S.p.A. — www.locautorent.it", W/2, H-10);
  ctx.textAlign = "left";

  return cv.toDataURL("image/jpeg", 0.92);
}

/* ─────────────────────────────────────────
   MAIN APP
───────────────────────────────────────── */
export default function App() {
  const [lang, setLang]           = useState("en");
  const [step, setStep]           = useState(1);
  const [drivers, setDrivers]     = useState([{ ...emptyDriver }]);
  const [showBill, setShowBill]   = useState(false);
  const [bill, setBill]           = useState({ ...emptyBill });
  const [photos, setPhotos]       = useState([]);
  const [contractId, setCid]      = useState("");
  const [sending, setSending]     = useState(false);
  const [sigMarked, setSigMarked] = useState(false);
  const [toast, setToast]         = useState(null);

  const sigRef = useRef(null);   // ref to SignatureCanvas imperative handle
  const t = TR[lang] || TR.it;

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 3500); }

  /* Drivers */
  function updD(i, k, v) { const a = [...drivers]; a[i] = { ...a[i], [k]: v }; setDrivers(a); }
  function addDriver()   { if (drivers.length < 2) setDrivers([...drivers, { ...emptyDriver }]); }
  function remDriver()   { setDrivers([drivers[0]]); }

  /* Photos */
  async function addPhotos(e) {
    for (const file of [...e.target.files]) {
      await new Promise(res => {
        const img = new Image(), reader = new FileReader();
        reader.onload = ev => {
          img.onload = () => {
            const cv = document.createElement("canvas");
            let w = img.width, h = img.height, mx = 1400;
            if (w > mx) { h *= mx/w; w = mx; }
            if (h > mx) { w *= mx/h; h = mx; }
            cv.width = w; cv.height = h;
            cv.getContext("2d").drawImage(img, 0, 0, w, h);
            setPhotos(p => [...p, { name: file.name, type: "image/jpeg", data: cv.toDataURL("image/jpeg", .68) }]);
            res();
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });
    }
    e.target.value = "";
  }

  /* Summary */
  function summaryRows() {
    let rows = [];
    drivers.forEach((d, i) => {
      if (drivers.length > 1) rows.push([`— ${IT.driver} ${i+1} —`, ""]);
      [[IT.name,d.name],[IT.birth,d.birth],[IT.street,d.street],
       [IT.city,d.city],[IT.zip,d.zip],[IT.country,d.country],
       [IT.mobile,d.mobile],[IT.email,d.email]].forEach(r => rows.push(r));
    });
    if (showBill) [[IT.company,bill.company],[IT.vat,bill.vat],
      [IT.bStreet,bill.bStreet],[IT.bCity,bill.bCity],[IT.bZip,bill.bZip],
      [IT.bEmail,bill.bEmail],["PEC",bill.pec],["SDI",bill.sdi]].forEach(r => rows.push(r));
    return rows.filter(x => x[1]);
  }

  /* SEND — generates PDF from canvas, sends to /.netlify/functions/send-nextfiles */
  async function sendMail() {
    if (!contractId.trim()) { alert(t.missingId); return; }
    if (!sigMarked)          { alert(t.missingSign); return; }
    setSending(true);
    try {
      const sigDataURL = sigRef.current?.getDataURL();
      const pdfBase64  = await buildPdfBase64(drivers, showBill, bill, contractId, sigDataURL, IT);
      const res = await fetch("/.netlify/functions/send-nextfiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId, pdfBase64, photos }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Server error");
      showToast(t.sent);
      reset();
    } catch (e) {
      alert(t.sendError + e.message);
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setDrivers([{ ...emptyDriver }]); setShowBill(false); setBill({ ...emptyBill });
    setPhotos([]); setCid(""); setSigMarked(false);
    sigRef.current?.clear();
    setStep(1);
  }

  /* ──────── RENDER ──────── */
  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {/* HERO — matches the physical sign: Locauto blue left / brands green right */}
        <div className="hero">
          {/* LEFT: Locauto */}
          <div className="hero-left">
            <div className="hero-elephant">🐘</div>
            <div className="hero-locauto">LOCAUTO</div>
            <div className="hero-tagline">Rent a Car</div>
          </div>
          {/* RIGHT: partner brands */}
          <div className="hero-right">
            <div className="brand-pill brand-national">
              <span>≋</span> National.
            </div>
            <div className="brand-pill brand-enterprise">
              <span>⊖</span> enterprise
            </div>
            <div className="brand-pill brand-alamo">
              Alamo®
            </div>
          </div>
        </div>
        {/* TITLE BAR */}
        <div className="hero-bar">
          <div className="hero-bar-title">Customer Registration</div>
          <div className="hero-bar-sub">Digital rental form</div>
        </div>

        {/* LANG */}
        <div className="lang-bar">
          <label>{t.lang}</label>
          <select value={lang} onChange={e => setLang(e.target.value)}>
            <option value="it">🇮🇹 Italiano</option>
            <option value="en">🇬🇧 English</option>
            <option value="es">🇪🇸 Español</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="pt">🇧🇷 Português</option>
            <option value="zh">🇨🇳 中文</option>
            <option value="ru">🇷🇺 Русский</option>
          </select>
        </div>

        {/* STEP BAR */}
        <div className="step-bar">
          {[t.step1, t.step2, t.step3].map((s, i) => (
            <div key={i}
              className={`step${step===i+1?" active":step>i+1?" done":""}`}
              onClick={() => step > i+1 && setStep(i+1)}>
              <span className="step-num">{step > i+1 ? "✓" : i+1}</span>{s}
            </div>
          ))}
        </div>

        <div className="body">

          {/* ══════ STEP 1 ══════ */}
          {step === 1 && <>
            {drivers.map((d, i) => (
              <Card key={i} icon="👤"
                title={drivers.length > 1 ? `${t.driver} ${i+1}` : t.driver}
                right={i === 0
                  ? drivers.length < 2 && <Btn variant="soft" small onClick={addDriver}>+ {t.addDriver}</Btn>
                  : <Btn variant="danger" small onClick={remDriver}>{t.removeDriver}</Btn>
                }>
                <Field label={t.name}>
                  <FInput value={d.name} onChange={e=>updD(i,"name",e.target.value.toUpperCase())} placeholder="MARIO ROSSI"/>
                </Field>
                <Field label={t.birth}>
                  <FInput value={d.birth} onChange={e=>updD(i,"birth",e.target.value)} placeholder="Roma, Italia"/>
                </Field>
                <div style={{margin:"4px 0 8px",padding:"8px 12px",background:"#e8f5fb",borderRadius:8,borderLeft:"3px solid #0794c8",display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:16}}>🏠</span>
                  <span style={{fontSize:12,fontWeight:700,color:"#0570a0"}}>
                    {lang==="it"?"Indirizzo di residenza":lang==="es"?"Dirección de residencia":lang==="fr"?"Adresse de résidence":lang==="pt"?"Endereço residencial":lang==="zh"?"住宅地址":lang==="ru"?"Домашний адрес":"Home / Residential Address"}
                  </span>
                </div>
                <Field label={t.street}>
                  <FInput value={d.street} onChange={e=>updD(i,"street",e.target.value)} placeholder={lang==="it"?"Via Roma 12/A":lang==="zh"?"北京路 12号":lang==="ru"?"ул. Ленина, д. 12":"123 Main Street, Apt 4B"}/>
                </Field>
                <div className="grid2">
                  <Field label={t.city}><FInput value={d.city} onChange={e=>updD(i,"city",e.target.value)} placeholder={lang==="zh"?"北京":lang==="ru"?"Москва":"Rome"}/></Field>
                  <Field label={t.zip}><FInput value={d.zip} onChange={e=>updD(i,"zip",e.target.value)} inputMode="numeric"/></Field>
                </div>
                <Field label={t.country}>
                  <FInput value={d.country} onChange={e=>updD(i,"country",e.target.value)} placeholder={lang==="it"?"Italia":lang==="zh"?"中国":lang==="ru"?"Россия":"Italy"}/>
                </Field>
                <PhoneField
                  label={t.mobile}
                  value={d.mobile}
                  onChange={v => updD(i,"mobile",v)}
                  lang={lang}
                  countryVal={d.country}
                />
                <Field label={t.email}>
                  <FInput value={d.email} onChange={e=>updD(i,"email",e.target.value)} inputMode="email" placeholder="email@esempio.it"/>
                </Field>
              </Card>
            ))}

            <Card icon="🧾" title={t.billing}
              right={<span style={{fontSize:12,color:C.muted}}>{t.optional}</span>}>
              <label className="tog" onClick={() => setShowBill(b => !b)}>
                <div className={`tog-track ${showBill?"on":""}`}/>
                <span className="tog-label">{t.billing}</span>
              </label>
              {showBill && <>
                <div className="grid2">
                  <Field label={t.company}><FInput value={bill.company} onChange={e=>setBill({...bill,company:e.target.value})}/></Field>
                  <Field label={t.vat}><FInput value={bill.vat} onChange={e=>setBill({...bill,vat:e.target.value})}/></Field>
                </div>
                <Field label={t.bStreet}><FInput value={bill.bStreet} onChange={e=>setBill({...bill,bStreet:e.target.value})}/></Field>
                <div className="grid2">
                  <Field label={t.bCity}><FInput value={bill.bCity} onChange={e=>setBill({...bill,bCity:e.target.value})}/></Field>
                  <Field label={t.bZip}><FInput value={bill.bZip} onChange={e=>setBill({...bill,bZip:e.target.value})} inputMode="numeric"/></Field>
                </div>
                <div className="grid2">
                  <Field label={t.pec}><FInput value={bill.pec} onChange={e=>setBill({...bill,pec:e.target.value})}/></Field>
                  <Field label={t.sdi}><FInput value={bill.sdi} onChange={e=>setBill({...bill,sdi:e.target.value})}/></Field>
                </div>
                <Field label={t.bEmail}><FInput value={bill.bEmail} onChange={e=>setBill({...bill,bEmail:e.target.value})} inputMode="email"/></Field>
              </>}
            </Card>

            <Btn onClick={() => setStep(2)}>{t.next}</Btn>
          </>}

          {/* ══════ STEP 2 ══════ */}
          {step === 2 && <>
            <Card icon="📷" title={IT.step2}
              right={<span style={{fontSize:12,color:photos.length>=6?C.blue:C.muted}}>{photos.length}/6</span>}>
              <p className="note" style={{marginBottom:14}}>{IT.photosNote}</p>
              {photos.length < 6 &&
                <label className="photo-add">
                  <span style={{fontSize:22}}>📸</span> {IT.addPhoto}
                  <input type="file" accept="image/*" multiple capture="environment" style={{display:"none"}} onChange={addPhotos}/>
                </label>
              }
              {photos.length > 0 &&
                <div className="photos">
                  {photos.map((p,i) => (
                    <div key={i} className="thumb">
                      <img src={p.data} alt=""/>
                      <button className="thumb-del" onClick={()=>setPhotos(ps=>ps.filter((_,ix)=>ix!==i))}>×</button>
                    </div>
                  ))}
                </div>
              }
            </Card>
            <div className="nav">
              <Btn variant="ghost" onClick={() => setStep(1)}>{t.back}</Btn>
              <Btn onClick={() => setStep(3)}>{t.next}</Btn>
            </div>
          </>}

          {/* ══════ STEP 3 ══════ */}
          {step === 3 && <>
            <Card icon="🔒" title="Privacy">
              <div className="privacy-box">{lang === "it" ? IT.privacy : TR.en.privacy}</div>
            </Card>

            <Card icon="✍️" title={IT.sign}
              right={sigMarked && <span style={{color:C.green,fontSize:12,fontWeight:800}}>✓ Firmato</span>}>
              <p className="note warn" style={{marginBottom:12}}>{IT.signNote}</p>
              <div className={`sig-outer ${sigMarked?"signed":""}`}>
                {/* SignatureCanvas is a stable component — refs work correctly */}
                <SignatureCanvas ref={sigRef} onMark={setSigMarked}/>
                {!sigMarked &&
                  <div className="sig-hint">
                    <span className="ico">✍️</span>{IT.signHint}
                  </div>
                }
              </div>
              <div className="gap"/>
              <Btn variant="ghost" small style={{width:"auto"}}
                onClick={() => { sigRef.current?.clear(); setSigMarked(false); }}>
                🗑 {IT.clearSig}
              </Btn>
            </Card>

            <Card icon="🔢" title={IT.contractId}>
              <Field label={IT.contractId}>
                <FInput value={contractId} onChange={e=>setCid(e.target.value.replace(/\D/g,""))}
                  inputMode="numeric" placeholder="0000000" className="id-input"/>
              </Field>
            </Card>

            <Card icon="📋" title={IT.summary}>
              {summaryRows().map(([k,v],idx) => (
                <div key={idx} className="sum-row">
                  <span className="sum-k">{k}</span>
                  <span className="sum-v">{v}</span>
                </div>
              ))}
            </Card>

            <Btn variant="success" onClick={sendMail} disabled={sending} style={{marginBottom:10}}>
              {sending ? `⏳ ${t.sending}` : `📨 ${t.send}`}
            </Btn>

            <div className="nav">
              <Btn variant="ghost" onClick={() => setStep(2)}>{t.back}</Btn>
              <Btn variant="danger" onClick={reset}>🔄 {t.newCustomer}</Btn>
            </div>
          </>}

          <div className="gap"/><div className="gap"/>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
