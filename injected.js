
// document.querySelector("#taught-courses-switcher").appendChild(
//     (() => {
//         const elm = document.createElement("i");

//         // elm.classList.add("fa-solid");
//         // elm.classList.add("fa-calendar-days");

//         // elm.src = "https://kit.fontawesome.com/09a93a2370.js";
//         // elm.crossOrigin = "anonymous";

//         // elm.innerHTML = "asjdnkjaskhjsabflfkhdsabfh bdshjafb asdhjkbf hjkdsab f";
//         return elm;
//     })()
// );

const importantPost = document.querySelector("#important-post");
// const pageHeadder = document.querySelector("#center-top");
if (importantPost != null)
{
    const mainInner = document.querySelector("#main-inner");
    mainInner.insertBefore(importantPost, mainInner.firstChild);
}


// const classAdditions = {
//     sr_button: [
//         ".sgy-tabbed-navigation > li"
//     ]
// };

// for (const key in classAdditions) {
//     const element = classAdditions[key];

//     element.forEach((selector) => {
//         const objs = document.querySelectorAll(selector);
//         objs.forEach((obj) => {
//             obj.classList.add(key);
//         });
//     });
// }