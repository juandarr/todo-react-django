import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCookie(name: string) {
  var cookieValue = name;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export function getPoint(t: string) {
  let target = document.getElementById(t);
  let [xTarget, yTarget] = [
    target.getBoundingClientRect().left,
    target.getBoundingClientRect().top,
  ];

  let [xDoc, yDoc] = [window.innerWidth, window.innerHeight];
  //console.log(xTarget, xDoc, yTarget, yDoc);
  return [xTarget / xDoc, yTarget / yDoc];
}
