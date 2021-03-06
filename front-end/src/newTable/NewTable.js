import { useState } from "react";
import { useHistory } from "react-router";
import FormErrors from "../errors/FormErrors";
import tableFormValidation from "../errors/tableFormValidation";
import { createTable } from "../utils/api";
import TableForm from "../utils/components/TableForm";
/** Defines the page to create a new table.
 *
 * @returns {JSX Element}
 */
function NewTable() {
  const initialFormData = {
    table_name: "",
    capacity: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [tableErrors, setTableErrors] = useState([]);
  const history = useHistory();
  const handleChange = ({ target }) => {
    let newValue = target.value;
    // combat the form changing numbers to strings for backend validation.
    if (target.type === "number") {
      newValue = Number(newValue);
    }
    setFormData({
      ...formData,
      [target.name]: newValue,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    const errors = tableFormValidation(formData);
    if (errors.length) {
      setTableErrors(errors);
    } else {
      try {
        await createTable(formData, abortController.signal);
        history.push("/dashboard");
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("NewReservation Aborted");
        } else {
          setTableErrors([error]);
        }
      }
    }
    return () => abortController.abort();
  };

  return (
    <main>
      {tableErrors.length > 0 && <FormErrors errors={tableErrors} />}
      <TableForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        legendTitle="New table"
      />
    </main>
  );
}

export default NewTable;
