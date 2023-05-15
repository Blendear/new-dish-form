//
//~~ _.  Form that's setting the dish data
//
//       _._. Time picker with "HH:MM:SS" format
//
//           _._._. 3 inputs - for hours, minutes and seconds, separately
//
//           _._._.
//
//           _._._.
//
//           _._._.
//
//       _._. Type of dish selector
//
//           _._._. JSX for the user
//
//           _._._. Handler - sets dish type state
//
//       _._. Dedicated input fields for Pizza, Soup or Sandwich's, conditionally rendered, depending on the selected type of dish
//
//           _._._. JSX data of special input fields
//
//           _._._. Conditional rendering of special input fields
//
//
//~~ _.  "Submit" button makes a POST request with out dish data
//
//       _._. Connecting "onSubmit" to our "redux-form" component
//
//       _._. Handler - activates the POST request when the form is submitted
//
//       _._. Handler - sends a POST request with the form data about our new dish
//
// hook1 read me file   &   time file

//hook1 - opisz komenatrzami wszystkie korki wszystkiego
import styles from "src/styles/sass/styles-all.module.scss";

import { Field, reduxForm } from "redux-form";
import { useState } from "react";
import Image from "next/image";
//~~ _.  "Submit" button makes a POST request with out dish data

//       _._. Handler - activates the POST request when the form is submitted

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

//       _._. Handler - sends a POST request with the form data about our new dish

const postRequestHandler = async (dishData) => {
  console.log("postRH activated");

  const timeString = createTimeStringHandler(
    dishData.timeHours,
    dishData.timeMinutes,
    dishData.timeSeconds
  );

  let conditionalDataHandler = {};

  switch (dishData.dishType) {
    case "Pizza":
      conditionalDataHandler = {
        name: dishData.dishName,

        preparation_time: timeString,

        type: dishData.dishType,
        diameter: dishData.diameter,
        no_of_slices: dishData.numberOfSlices,
      };
      break;
    case "Soup":
      conditionalDataHandler = {
        name: dishData.dishName,
        preparation_time: timeString,
        type: dishData.dishType,
        spiciness_level: dishData.spicinesScale,
      };
      break;
    case "Sandwich":
      conditionalDataHandler = {
        name: dishData.dishName,
        preparation_time: timeString,
        type: dishData.dishType,
        no_of_slices: dishData.numberOfSlicesOfBreadRequired,
      };
      break;
  }

  fetch("https://enplyd8uecj8h.x.pipedream.net/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conditionalDataHandler,
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
  const { handleSubmit, pristine, reset, submitting } = props;

  const [typeOfDish, setTypeOfDish] = useState("");
  const [nrOfImage, setNrOfImage] = useState("2");

  const changeNrOfPizzaSlicesHandler = (event) => {
    const newValue = event.target.value;
    if (newValue < 2 || newValue > 8) {
      return;
    }
    // setNrOfPizzaSlices(newValue);
    setNrOfImage(newValue);
  };
  const changePizzaDiameterHandler = (event) => {
    const newValue = event.target.value;
    if (newValue < 23 || newValue > 48) {
      return;
    }
    // setPizzaDiameter(newValue);
  };
  const changeLevelOfSpicinessHandler = (event) => {
    const newValue = event.target.value;
    if (newValue < 1 || newValue > 10) {
      return;
    }
    // setSpicinessLevel(newValue);
    setNrOfImage(newValue);
  };
  const changeNrOfBreadSlicesHandler = (event) => {
    const newValue = event.target.value;
    if (newValue < 2 || newValue > 6) {
      return;
    }
    // setNrOfBreadSlices(newValue);
    setNrOfImage(newValue);
  };
  //           _._._. JSX data of special input fields

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

  //           _._._. Handler - sets dish type state

  const selectDishTypeHandler = (event) => {
    setTypeOfDish(event.target.value);
    // console.log(event.target.value);
  };

  return (
    //~~ _.  Form that's setting the dish data

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
      {/* form-new-dish-variant__input-field__prep-time__value__hh */}
      {/* // _._. Time picker with "HH:MM:SS" format
            
            // _._._. 3 inputs - for hours, minutes and seconds, separately 
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
      //       _._. Type of dish selector
            
      //           _._._. JSX for the user
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
        <option value="Pizza">Pizza</option>
        <option value="Soup">Soup</option>
        <option value="Sandwich">Sandwich</option>
      </Field>

      {/*
      _._. Dedicated input fields for Pizza, Soup or Sandwich's, conditionally rendered, depending on the selected type of dish

      _._._. Conditional rendering of special input fields 
      */}
      {typeOfDish === "Pizza" && dishesSpecialInputFields.pizza}
      {typeOfDish === "Soup" && dishesSpecialInputFields.soup}
      {typeOfDish === "Sandwich" && dishesSpecialInputFields.sandwich}

      <button
        className={styles["form-new-dish-variant__submit-btn"]}
        type="submit"
        disabled={pristine || submitting}
      >
        Submit
      </button>
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
    </form>
  );
};

export default reduxForm({
  form: "simple", // a unique identifier for this form
  // _._. Connecting "onSubmit" to our "redux-form" component
  onSubmit,
})(SimpleForm);
