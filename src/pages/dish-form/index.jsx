// [ TABLE OF CONTENT ]
//
//~~ 1.  Imports - necessary for this file to work
//
//
//
//~~ 2.  Form that's setting the dish data
//
//       2.1. Time picker with "HH:MM:SS" format
//
//           2.1.1. Three inputs - for hours, minutes and seconds, separately
//
//       2.2. Type of dish selector
//
//           2.2.1. JSX for the user
//
//           2.2.2. Handler - sets dish type state
//
//           2.2.3. State - stores dish type state

//       2.3. Dedicated input fields for Pizza, Soup or Sandwich's, conditionally rendered, depending on the selected type of dish
//
//           2.3.1. JSX data of special input fields
//
//           2.3.2. Conditional rendering of special input fields
//
//
//
//~~ 3.  Dynamic image for visualizing the properties chosen/given through input fields (Conditionally rendered, if type of dish is chosen)
//
//       3.1. PNG - for the user
//
//           3.1.1. Dynamic source path, depending on the states of "typeOfDish" & "nrOfImage"
//
//       3.2. Handlers & State - Handlers for setting and storing the number state, which decides (together with "typeOfDish" state ) about which PNG image sohuld be rendered
//
//       3.3. Diameter, which is dynamically visualized on the "Pizza" PNG visualisation (which is rendered, when type "Pizza" is chosen)
//
//           3.3.1. Handler - changes diameter of "pizzaDiameter" (rendered on the "Pizza" PNG)
//
//           3.3.2. State - stores diameter value (rendered on the "Pizza" PNG)
//
//           3.3.3. JSX - renders the number on the "Pizza" PNG for the user to see
//
//
//~~ 4.  "Submit" button makes a POST request with out dish data
//
//       4.1. Connecting "onSubmit" to our "redux-form" component
//
//       4.2. Handler - activates the POST request when the form is submitted
//
//       4.3. Handler - sends a POST request with the form data about our new dish
//
//           4.3.1. Variables - which stores the input field's data (which is formated and updated with conditional content)
//
//           4.3.2. Fetch POST request - for testing (development) purposes only
//
//           4.3.3. Fetch POST request - the one used for production
//
//

//~~ 1.  Imports - necessary for this file to work

import styles from "src/styles/sass/styles-all.module.scss";
import { Field, reduxForm } from "redux-form";
import { useState } from "react";
import Image from "next/image";

//~~ 4.  "Submit" button makes a POST request with out dish data

//       4.2. Handler - activates the POST request when the form is submitted

const onSubmit = (values) => {
  // console.log("onSubmit activated");
  // alert(JSON.stringify(values));
  postRequestHandler(values);
};

const createTimeStringHandler = (h, m, s) => {
  const timeNumbers = [h, m, s];

  for (let i = 0; i < 3; i++) {
    if (timeNumbers[i] < 10) {
      timeNumbers[i] = "0" + timeNumbers[i];
      // console.log(timeNumbers[i]);
    }
  }
  return timeNumbers[0].concat(":", timeNumbers[1]).concat(":", timeNumbers[2]);
};

//       4.3. Handler - sends a POST request with the form data about our new dish

const postRequestHandler = async (dishData) => {
  // console.log("postRH activated");

  //           4.3.1. Variables - which stores the input field's data (which is formated and updated with conditional content)

  const timeString = createTimeStringHandler(
    dishData.timeHours,
    dishData.timeMinutes,
    dishData.timeSeconds
  );

  let conditionalDataHandler = {};

  switch (dishData.dishType) {
    case "pizza":
      conditionalDataHandler = {
        name: dishData.dishName,

        preparation_time: timeString,

        type: dishData.dishType,
        diameter: dishData.diameter,
        no_of_slices: dishData.numberOfSlices,
      };
      break;
    case "soup":
      conditionalDataHandler = {
        name: dishData.dishName,
        preparation_time: timeString,
        type: dishData.dishType,
        spiciness_level: dishData.spicinesScale,
      };
      break;
    case "sandwich":
      conditionalDataHandler = {
        name: dishData.dishName,
        preparation_time: timeString,
        type: dishData.dishType,
        no_of_slices: dishData.numberOfSlicesOfBreadRequired,
      };
      break;
  }
  //           4.3.2. Fetch POST request - for testing (development) purposes only

  fetch("https://enplyd8uecj8h.x.pipedream.net/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(conditionalDataHandler),
  })
    .then((response) => response.json())
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((error) => {
      console.error("Something went wrong", error);
    });

  //           4.3.3. Fetch POST request - the one used for production

  fetch("https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...conditionalDataHandler,
    }),
  })
    .then((response) => response.json())
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((error) => {
      console.error("Something went wrong", error);
    });
};

const SimpleForm = (props) => {
  const { handleSubmit, pristine, submitting } = props;

  //           2.2.3. State - stores dish type state

  const [typeOfDish, setTypeOfDish] = useState("");

  //       3.3. Diameter, which is dynamically visualized on the "Pizza" PNG visualisation (which is rendered, when type "Pizza" is chosen)
  //
  //           3.3.2. State - stores diameter value (rendered on the "Pizza" PNG)

  const [pizzaDiameter, setPizzaDiameter] = useState(23.0);

  //       3.2. Handlers & State - Handlers for setting and storing the number state, which decides (together with "typeOfDish" state ) about which PNG image sohuld be rendered

  const [nrOfImage, setNrOfImage] = useState("2");

  const changeNrOfPizzaSlicesHandler = (event) => {
    const newValue = event.target.value;
    if (newValue < 2 || newValue > 8) {
      return;
    }
    setNrOfImage(newValue);
  };

  const changeLevelOfSpicinessHandler = (event) => {
    const newValue = event.target.value;
    if (newValue < 1 || newValue > 10) {
      return;
    }

    setNrOfImage(newValue);
  };
  const changeNrOfBreadSlicesHandler = (event) => {
    const newValue = event.target.value;
    if (newValue < 2 || newValue > 6) {
      return;
    }

    setNrOfImage(newValue);
  };

  //           3.3.1. Handler - changes diameter of "pizzaDiameter" (rendered on the "Pizza" PNG)

  const changePizzaDiameterHandler = (event) => {
    const newValue = event.target.value;
    if (newValue < 23 || newValue > 48) {
      return;
    }

    setPizzaDiameter(newValue);
  };

  //           2.3.1. JSX data of special input fields

  const [dishesSpecialInputFields, setDishesSpecialInputFields] = useState({
    pizza: (
      <div
        className={
          styles["form-new-dish-variant__conditionally-rendered-input-fields"]
        }
      >
        <label
          className={
            styles[
              "form-new-dish-variant__conditionally-rendered-input-fields__nr-of-slices__title"
            ]
          }
        >
          Nr of slices
        </label>
        <Field
          className={
            styles[
              "form-new-dish-variant__conditionally-rendered-input-fields__nr-of-slices__value"
            ]
          }
          onChange={changeNrOfPizzaSlicesHandler}
          name="numberOfSlices"
          component="input"
          type="number"
          min="2"
          max="12"
          placeholder="2 - 8"
          required
        />

        <label
          className={
            styles[
              "form-new-dish-variant__conditionally-rendered-input-fields__diameter__title"
            ]
          }
        >
          Diameter
        </label>
        <Field
          className={
            styles[
              "form-new-dish-variant__conditionally-rendered-input-fields__diameter__value"
            ]
          }
          onChange={changePizzaDiameterHandler}
          name="diameter"
          component="input"
          type="number"
          min="23"
          max="48"
          placeholder="23 - 48"
          step="0.1"
          required
        />
      </div>
    ),
    soup: (
      <div
        className={
          styles["form-new-dish-variant__conditionally-rendered-input-fields"]
        }
      >
        <label
          className={
            styles[
              "form-new-dish-variant__conditionally-rendered-input-fields__spiciness-scale__title"
            ]
          }
        >
          Spiciness scale
        </label>
        <Field
          className={
            styles[
              "form-new-dish-variant__conditionally-rendered-input-fields__spiciness-scale__value"
            ]
          }
          onChange={changeLevelOfSpicinessHandler}
          name="spicinesScale"
          component="input"
          type="number"
          min="1"
          max="10"
          placeholder="1 - 10"
          required
        />
      </div>
    ),
    sandwich: (
      <div
        className={
          styles["form-new-dish-variant__conditionally-rendered-input-fields"]
        }
      >
        <label
          className={
            styles[
              "form-new-dish-variant__conditionally-rendered-input-fields__nr-of-slices-of-bread__title"
            ]
          }
        >
          Nr of bread slices
        </label>
        <Field
          className={
            styles[
              "form-new-dish-variant__conditionally-rendered-input-fields__nr-of-slices-of-bread__value"
            ]
          }
          onChange={changeNrOfBreadSlicesHandler}
          name="numberOfSlicesOfBreadRequired"
          component="input"
          type="number"
          min="2"
          max="6"
          placeholder="2 - 6"
          required
        />
      </div>
    ),
  });

  //           2.2.2. Handler - sets dish type state

  const selectDishTypeHandler = (event) => {
    setTypeOfDish(event.target.value);
  };

  return (
    //~~ 2.  Form that's setting the dish data

    <form
      onSubmit={handleSubmit}
      className={`${styles["form-light-theme"]} ${styles["form-new-dish-variant__container"]}`}
    >
      <div className={styles["form-new-dish-variant__image-of-form__bg"]}>
        <Image
          src={`/images/form/title-image/title-image.png`}
          alt={`Error when loading image`}
          layout="fill"
          objectFit="contain"
          priority
          loading="eager"
        />
      </div>
      <h1 className={styles["form-new-dish-variant__image-of-form__text"]}>
        My Beautiful Dish
      </h1>
      <label
        className={
          styles["form-new-dish-variant__input-field__dish-name__title"]
        }
      >
        Dish name
      </label>
      <Field
        className={
          styles["form-new-dish-variant__input-field__dish-name__value"]
        }
        name="dishName"
        component="input"
        type="text"
        placeholder="Non-letters are allowed"
        required
      />

      {/* 
      //       2.1. Time picker with "HH:MM:SS" format
      //
      //           2.1.1. Three inputs - for hours, minutes and seconds, separately
      */}
      <label
        className={
          styles["form-new-dish-variant__input-field__prep-time__title"]
        }
      >
        Preparation time
      </label>
      <div
        className={
          styles["form-new-dish-variant__input-field__prep-time__container"]
        }
      >
        <Field
          className={
            styles["form-new-dish-variant__input-field__prep-time__value__hh"]
          }
          name="timeHours"
          component="input"
          type="number"
          min="0"
          max="24"
          placeholder="Hr"
          required
        />
        <div
          className={
            styles[
              "form-new-dish-variant__input-field__prep-time__value__dots-left"
            ]
          }
        >
          :
        </div>
        <Field
          className={
            styles["form-new-dish-variant__input-field__prep-time__value__mm"]
          }
          name="timeMinutes"
          component="input"
          type="number"
          min="0"
          max="59"
          placeholder="Min"
          required
        />
        <div
          className={
            styles[
              "form-new-dish-variant__input-field__prep-time__value__dots-right"
            ]
          }
        >
          :
        </div>
        <Field
          className={
            styles["form-new-dish-variant__input-field__prep-time__value__ss"]
          }
          name="timeSeconds"
          component="input"
          type="number"
          min="0"
          max="59"
          placeholder="Sec"
          required
        />
      </div>

      {/* 
      //       2.2. Type of dish selector
            
      //           2.2.1. JSX for the user
      */}

      <label
        className={
          styles["form-new-dish-variant__input-field__dish-type__title"]
        }
      >
        Type of dish
      </label>

      <Field
        className={
          styles["form-new-dish-variant__input-field__dish-type__value"]
        }
        onChange={selectDishTypeHandler}
        name="dishType"
        component="select"
        required
      >
        <option value=""></option>
        <option value="pizza">Pizza</option>
        <option value="soup">Soup</option>
        <option value="sandwich">Sandwich</option>
      </Field>

      {/*
      //       2.3. Dedicated input fields for Pizza, Soup or Sandwich's, conditionally rendered, depending on the selected type of dish

      //           2.3.2. Conditional rendering of special input fields

      */}
      {typeOfDish === "pizza" && dishesSpecialInputFields.pizza}
      {typeOfDish === "soup" && dishesSpecialInputFields.soup}
      {typeOfDish === "sandwich" && dishesSpecialInputFields.sandwich}

      <button
        className={styles["form-new-dish-variant__submit-btn"]}
        type="submit"
        disabled={pristine || submitting}
      >
        Submit
      </button>
      {/* 
      //~~ 3.  Dynamic image for visualizing the properties chosen/given through input fields (Conditionally rendered, if type of dish is chosen)
      //
      //       3.1. PNG - for the user
      //
      //           3.1.1. Dynamic source path, depending on the states of "typeOfDish" & "nrOfImage"
      */}
      {typeOfDish !== "" && (
        <div
          className={styles["form-new-dish-variant__image-of-dish-type__png"]}
        >
          <Image
            src={`/images/form/${typeOfDish}/${nrOfImage}.png`}
            alt={`Error with loading the image`}
            layout="fill"
            objectFit="contain"
            priority
            loading="eager"
          />
        </div>
      )}
      {/* 
      //           3.3.3. JSX - renders the number on the "Pizza" PNG for the user to see
      */}
      {typeOfDish === "pizza" && (
        <div
          className={
            styles["form-new-dish-variant__image-of-dish-type__diameter"]
          }
        >
          {pizzaDiameter} <br /> cm
        </div>
      )}
    </form>
  );
};

export default reduxForm({
  form: "simple",
  // 4.1. Connecting "onSubmit" to our "redux-form" component
  onSubmit,
})(SimpleForm);
