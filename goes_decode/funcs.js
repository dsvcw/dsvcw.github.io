const get_num = (id, default_val) => {
    let num = document.getElementById(id).value
    if (num === "") {
        num = default_val
    } else {
        num = Number(num)
    }
    return num
}

// Get Values
const get_vals = () => {
    let msg = document.getElementById("e_msg").value
    let start = Math.max(0, get_num("msg_start", 0))
    let end = Math.min(msg.length, get_num("msg_end", msg.length))
    let divider = get_num("div", 1)
    let multiplier = get_num("mul", 1)
    let adder = get_num("add", 1)
    let ndig = get_num("ndig", 2)

    return [msg, start, end, divider, multiplier, adder, ndig]
}

// Decode
const decode = () => {
    let msg, start, end, divider, multiplier, adder, ndig
    [msg, start, end, divider, multiplier, adder, ndig] = get_vals()
    let msg_slice = msg.slice(start, end)
    let decoded_value = decode_pseudobinary(msg_slice)
    let ans = (adder + decoded_value * multiplier / divider).toFixed(ndig)
    set_vals(msg_slice, decoded_value, ans)
}

const set_vals = (msg, decoded_value, ans) => {
    let encoded_o = document.getElementById("encoded_output")
    encoded_o.textContent = msg

    let decoded_o = document.getElementById("decoded_output")
    decoded_o.textContent = decoded_value

    let ans_o = document.getElementById("decoded_ans")
    ans_o.textContent = ans
}
const pad = (num, size) => {
    num = num.toString();
    while (num.length < size) {
        num = "0" + num
    }
    return num;
}

const decode_pseudobinary = encoded_data => {
    let binary_value, binary_value_arr, decimal_value, decoded_value, intermediate_str;
    binary_value_arr = [];

    for (let i = 0; i < encoded_data.length; i++) {
        let chr = encoded_data.charAt(i)

        if (chr === "?") {
            binary_value = "111111";
        } else {
            decimal_value = chr.charCodeAt(0)
            binary_value = pad((decimal_value - 64).toString(2), 6);
        }

        binary_value_arr.push(binary_value);
    }

    intermediate_str = binary_value_arr.join("");

    decoded_value = Number.parseInt(intermediate_str, 2);

    return Number(decoded_value);
}