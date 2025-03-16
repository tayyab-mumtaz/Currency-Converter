const BASE_URL = "https://v6.exchangerate-api.com/v6/c907337bcfbc61bafe053130";

// Select elements
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Ensure countryList is loaded
if (countryList) {
    console.error("countryList is not defined. Make sure countryList.js is loaded first.");
}

// Populate dropdowns with currency codes
for (let select of dropdowns) {
    for (let currentCode in countryList) {
        console.log(currentCode);
        let option = document.createElement("option");
        option.value = currentCode;
        option.innerText = currentCode;

        if (select.name === "from" && currentCode === "PKR") {
            option.selected = "selected";
        } else if (select.name === "to" && currentCode === "USD") {
            option.selected = "selected";
        }
        select.append(option);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update country flag based on selected currency
const updateFlag = (element) => {
    let currentCode = element.value;
    let countryCode = countryList[currentCode];

    if (!countryCode) {
        console.error(`No country code found for ${currentCode}`);
        return;
    }

    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");

    if (img) {
        img.src = newSrc;
    }
};

// Handle currency conversion on button click
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const URL = `${BASE_URL}/pair/${fromCurr.value}/${toCurr.value}`;
    console.log("Fetching:", URL);

    try {
        let response = await fetch(URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        console.log("API Response:", data);

        if (!data.conversion_rate) {
            msg.innerText = "Exchange rate not available!";
            return;
        }

        let rate = data.conversion_rate;
        let finalAmount = (amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        msg.innerText = "Failed to fetch exchange rate. Try again.";
    }
});
