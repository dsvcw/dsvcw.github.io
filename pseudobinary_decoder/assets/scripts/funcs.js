// Get numbers from html element by id
const get_num = (id, default_val) => {
  let num = document.getElementById(id).value;
  if (num === "") {
    num = default_val;
    set_val(id, default_val);
  } else {
    num = Number(num);
  }
  return num;
};

// Set value in input
const set_val = (id, default_val) => {
  let el = document.getElementById(id);
  el.value = default_val;
};

// Get Values
const get_vals = (msg) => {
  let start = get_num("msg_start", 0);
  let end = get_num("msg_end", msg.length);
  let divider = get_num("div", 100);
  let multiplier = get_num("mul", 1);
  let adder = get_num("add", 0);
  let ndig = get_num("ndig", 2);

  return [start, end, divider, multiplier, adder, ndig];
};

// Entry
const main = () => {
  let msg = document.getElementById("e_msg").value;
  msg = msg.trim();
  set_val("e_msg", msg);
  let start, end, divider, multiplier, adder, ndig;
  [start, end, divider, multiplier, adder, ndig] = get_vals(msg);
  let is_err = check_vals(
    msg.length,
    start,
    end,
    divider,
    multiplier,
    adder,
    ndig
  );
  if (!is_err) {
    add_error("None");
    let msg_slice = msg.slice(start, end);
    let decoded_value = decode_pseudobinary(msg_slice);
    let ans = (adder + (decoded_value * multiplier) / divider).toFixed(ndig);
    set_result_vals(msg_slice, decoded_value, ans);

    let signed_value = decode_signed_pseudobinary(decoded_value);
    let signed_ans = (adder + (signed_value * multiplier) / divider).toFixed(
      ndig
    );
    set_signed_result_vals(signed_value, signed_ans);
  } else {
    set_result_vals("##", "##", "##");
  }
};

// check input values
const check_vals = (msg_len, start, end, divider, multiplier, adder, ndig) => {
  clear_error();

  let is_err = false;

  if (msg_len === 0) {
    is_err = true;
    add_error(`<code>Encoded Message</code> cannot be empty`);
  } else {
    if (start >= msg_len) {
      is_err = true;
      add_error(
        `<code>Start</code> cannot be equal to or greater than <code>${msg_len}</code> (message length)`
      );
    }

    if (end > msg_len) {
      is_err = true;
      add_error(
        `<code>End</code> cannot be greater than <code>${msg_len}</code> (message length)`
      );
    }

    if (start >= end) {
      is_err = true;
      add_error(
        "<code>Start</code> cannot be equal to or greater than <code>End</code>"
      );
    }
  }

  if (divider === 0) {
    is_err = true;
    add_error("<code>Divider</code> cannot be <code>0</code>");
  }

  if (multiplier === 0) {
    is_err = true;
    add_error("<code>Multiplier</code> cannot be <code>0</code>");
  }

  let err_h3 = document.querySelector(".error-h3");

  if (is_err) {
    err_h3.style.visibility = "visible";
  } else {
    err_h3.style.visibility = "hidden";
  }

  return is_err;
};

// Add error message
const add_error = (msg) => {
  let err_container = document.querySelector("#err-container");
  if (msg == "None") {
    err_container.classList.remove("border", "border-danger");
  } else {
    err_container.classList.add("border", "border-danger");
    let err_el = document.getElementById("err");
    let li = document.createElement("li");
    li.classList.add("err-msg");
    li.innerHTML = msg;
    err_el.appendChild(li);
  }
};

// clear error messages
const clear_error = () => {
  let err_el = document.getElementById("err");
  err_el.innerHTML = "";
};

// Display Results
const set_result_vals = (msg, decoded_value, ans) => {
  set_textcontent("encoded_output", msg);
  set_textcontent("decoded_output", decoded_value);
  set_textcontent("decoded_ans", ans);
};

const set_signed_result_vals = (decoded_value, ans) => {
  set_textcontent("signed_decoded_output", decoded_value);
  set_textcontent("signed_decoded_ans", ans);
};

// grab elements by id and set value
const set_textcontent = (id, value) => {
  let el = document.getElementById(id);
  el.textContent = value;
  if (value === "##") {
    el.classList.add("text-danger");
  } else {
    el.classList.remove("text-danger");
  }
};

// add leading zero to integers
const pad = (num, size) => {
  num = num.toString();
  while (num.length < size) {
    num = "0" + num;
  }
  return num;
};

// decode
const decode_pseudobinary = (encoded_data) => {
  let binary_value, decimal_value, decoded_value, intermediate_str;

  let binary_value_arr = [];

  for (let i = 0; i < encoded_data.length; i++) {
    let chr = encoded_data.charAt(i);

    if (chr === "?") {
      binary_value = "111111";
    } else {
      decimal_value = chr.charCodeAt(0);
      binary_value = pad((decimal_value - 64).toString(2), 6);
    }

    binary_value_arr.push(binary_value);
  }

  intermediate_str = binary_value_arr.join("");

  decoded_value = Number.parseInt(intermediate_str, 2);

  return Number(decoded_value);
};

// decode
const decode_signed_pseudobinary = (decoded_value) =>
  decoded_value > 131071 ? 131072 - decoded_value : decoded_value;

// set params to decode custom, sutron voltage, or DA voltage
const set_params = (op) => {
  let msg = document.getElementById("e_msg").value;
  msg = msg.trim();
  let msg_start;
  if (msg.length > 0) {
    msg_start = msg.length - 1;
  } else {
    msg_start = 0;
  }

  if (op === "sutron") {
    set_val("msg_start", msg_start);
    set_val("msg_end", msg_start + 1);
    set_val("div", 1);
    set_val("mul", 0.234);
    set_val("add", 10.6);
    set_val("ndig", 2);
  } else if (op === "da") {
    set_val("msg_start", msg_start);
    set_val("msg_end", msg_start + 1);
    set_val("div", 1);
    set_val("mul", 0.3124);
    set_val("add", 0.311);
    set_val("ndig", 2);
  } else if (op === "custom") {
    msg_start = Math.min(4, msg.length - 1);
    set_val("msg_start", msg_start);
    set_val("msg_end", Math.min(7, msg.length));
    set_val("div", 100);
    set_val("mul", 1);
    set_val("add", 0);
    set_val("ndig", 2);
  }
  ["da", "sutron", "custom"].forEach((op_) => {
    let id_ = `#${op_}_params`;
    let inp = document.querySelector(id_);
    let lab = inp.nextElementSibling;
    if (op_ === op) {
      lab.classList.add("active");
    } else {
      lab.classList.remove("active");
    }
  });
};
