import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
import { formatDateTime, only_number } from '../../helper/general.js';
const DetailMdl = (props) => {
    const [loading, setLoading] = useState(false);
    const today_date = formatDateTime(new Date(), "date");
    const input_value = {
      user_id: props.type=="Edit"?props.item.user_id: 0,
      employee_id: props.item.employee_id || "",
      designation: props.item.designation || "",
      joinig_date: props.item.joinig_date || "",
      uan: props.item.uan || "",
      gross_salary: props.item.gross_salary || 0,
      //earning
      basic_salary: props.item.basic_salary || 0,
      house_rent_allowances: props.item.house_rent_allowances || 0,
      conveyance_allowances: props.item.conveyance_allowances || 0,
      personal_allowances: props.item.personal_allowances || 0,
      special_allowances: props.item.special_allowances || 0,
      satutory_bonus: props.item.satutory_bonus || 0,
      //deduction
      epf: props.item.epf || 0,
      health_ensurance: props.item.health_ensurance || 0,
      professional_tax: props.item.professional_tax || 0,
      if_80_g_act: props.item.if_80_g_act || 0,
      gratuity: props.item.gratuity || 0,
      id_uniform: props.item.id_uniform || 0,
      //totalDeduction
      total_deduction: props.item.total_deduction || 0,
      //total pay
      net_pay: props.item.net_pay || 0,
      
      half_day: props.item.half_day || 0,
      half_day_deduction: props.item.half_day_deduction || 0,
      total_working_days: props.item.total_working_days || 0,
      total_paid_days: props.item.total_paid_days || 0,
      bank_name: props.item.bank_name || 0,
      ac_h_name: props.item.ac_h_name || 0,
      ac_no: props.item.ac_no || 0,
      ifsc: props.item.ifsc || 0,

      lwp: props.item.lwp || 0,

      month:props.item.payout_month,
    };
    const [values, setValues] = useState(input_value);
    const [error, setError] = useState([]);
    useEffect(() => {
      const total_deduction_value =
        (values.epf ? parseFloat(values.epf) : 0) +
        (values.health_ensurance ? parseFloat(values.health_ensurance) : 0) +
        (values.professional_tax ? parseFloat(values.professional_tax) : 0) +
        (values.if_80_g_act ? parseFloat(values.if_80_g_act) : 0) +
        (values.gratuity ? parseFloat(values.gratuity) : 0) +
        (values.id_uniform ? parseFloat(values.id_uniform) : 0);
      setValues((oldValues) => ({
        ...oldValues,
        total_deduction: total_deduction_value,
      }));
    }, [
      values.epf,
      values.professional_tax,
      values.health_ensurance,
      values.if_80_g_act,
      values.gratuity,
      values.id_uniform,
    ]);
    useEffect(() => {
      const net_pay_total =
        (values.gross_salary ? parseFloat(values.gross_salary) : 0) -
        (values.total_deduction ? parseFloat(values.total_deduction) : 0);
      setValues((oldValues) => ({ ...oldValues, net_pay: net_pay_total }));
    }, [values.total_deduction, values.gross_salary]);
    const input_field = [
      {
        label: "Basic Salary",
        name: "basic_salary",
        value: values.basic_salary,
      },
      {
        label: "House Rent Allowances",
        name: "house_rent_allowances",
        value: values.house_rent_allowances,
      },
      {
        label: "Conveyance Allowances",
        name: "conveyance_allowances",
        value: values.conveyance_allowances,
      },
      {
        label: "Personal Allowances",
        name: "personal_allowances",
        value: values.personal_allowances,
      },
      {
        label: "Special Allowances",
        name: "special_allowances",
        value: values.special_allowances,
      },
      {
        label: "Satutory Bonus",
        name: "satutory_bonus",
        value: values.satutory_bonus,
      },
      {
        label: "Gross Salary",
        name: "gross_salary",
        readonly: "readonly",
        value: (values.gross_salary =
          (values.basic_salary ? parseFloat(values.basic_salary) : 0) +
          (values.house_rent_allowances
            ? parseFloat(values.house_rent_allowances)
            : 0) +
          (values.conveyance_allowances
            ? parseFloat(values.conveyance_allowances)
            : 0) +
          (values.personal_allowances
            ? parseFloat(values.personal_allowances)
            : 0) +
          (values.special_allowances
            ? parseFloat(values.special_allowances)
            : 0) +
          (values.satutory_bonus ? parseFloat(values.satutory_bonus) : 0)),
      },
    ];
  
    const submitForm = (e) => {
      e.preventDefault();
      if (values.user_id === 0) {
        toast.error("Select Teacher Name");
      } else if (
        values.employee_id === "" ||
        values.employee_id === undefined ||
        values.employee_id === null
      ) {
        toast.error("Please Enter Employee Id");
      } else if (
        values.designation === "" ||
        values.designation === undefined ||
        values.designation === null
      ) {
        toast.error("Please Enter designation ");
      } else if (
        values.joinig_date === "" ||
        values.joinig_date === undefined ||
        values.joinig_date === null
      ) {
        toast.error("Please select joinig_date ");
      } else if (values.basic_salary === 0) {
        toast.error("Please Enter Basic Salary");
      } else if (values.house_rent_allowances === 0) {
        toast.error("Please Enter House Rent Allowances");
      } else if (values.conveyance_allowances === 0) {
        toast.error("Please Enter Conveyance Allowances");
      } else if (values.personal_allowances === 0) {
        toast.error("Please Enter Personal Allowances");
      } else if (values.special_allowances === 0) {
        toast.error("Please Enter Special Allowances");
      } else if (values.epf === 0) {
        toast.error("Please Enter EPF (12%)");
      } else if (values.health_ensurance === 0) {
        toast.error("Please Enter Health Insurance/ESIC(0.75%)");
      } else if (values.professional_tax === 0) {
        toast.error("Please Enter  Professional Tax (Rs)");
      } else {
        setLoading(true);
        call_secure_api("salary/update_payout", values).then(
          (resolve) => {
            if (resolve.status === true) {
              toast.success(resolve.message, "success", 5000);
              props.model_handler(true);
            } else {
              if (resolve.data) {
                setError(resolve.data);
              } else {
                setError([]);
              }
              toast.error(resolve.message, "error", 5000);
            }
            setLoading(false);
          },
          (reject) => {
            console.log(reject);
            toast.error("Server Error", "error", 5000);
            setLoading(false);
          }
        );
      }
    };
  
    const set = (name) => {
      return ({ target: { value } }) => {
        setValues((oldValues) => ({ ...oldValues, [name]: value }));
      };
    };
    return (
      <Modal
        size={"lg"}
        fade={false}
        isOpen={true}
        backdrop="static"
        keyboard={false}
      >
        <ModalHeader
          close={
            <button
              type={"button"}
              className="btn-close"
              onClick={() => {
                props.model_handler(false);
              }}
            ></button>
          }
        >
          <CardText>{props.type} Salary</CardText>
        </ModalHeader>
        <ModalBody>
          <form action="" onSubmit={submitForm}>
            <div className="row">
              <div className="col-sm-6">
                <label className="col-form-label form-label">
                  Select Teacher Name <span className="text-danger">*</span>
                </label>
                {props.type=="Edit"? 
                 <input 
                  type="text"
                  readOnly={true}
                  value={props.item.full_name}
                  className="form-control form-control-sm"
                />
                :
                <select
                  name="user_id"
                  value={values.user_id}
                  className="form-control form-control-sm"
                  onChange={set("user_id")}
                >
                  <option value="">Select</option>
                  {props.userNames &&
                    props.userNames.map((item, key) => {
                      return (
                        <option key={key} value={item.id}>
                          {item.full_name + "  (" + item.reg_code + ") "}
                        </option>
                      );
                    })}
                </select>}
                {error["user_id"] && (
                  <label className="text-danger">
                    Select Teacher Name fildes are required
                  </label>
                )}
              </div>
              <div className="col-sm-6">
                <label className="col-form-label form-label">
                  Employee ID <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={values.employee_id}
                  name="employee_id"
                  placeholder=" "
                  maxLength={50}
                  className="form-control text-uppercase form-control-sm"
                  onChange={set("employee_id")}
                />
                {error["employee_id"] && (
                  <label className="text-danger">{error["employee_id"]}</label>
                )}
              </div>
              <div className="col-sm-6">
                <label className="col-form-label form-label">
                  Designation <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={values.designation}
                  name="designation"
                  placeholder=""
                  maxLength={50}
                  className="form-control text-uppercase form-control-sm"
                  onChange={set("designation")}
                />
                {error["designation"] && (
                  <label className="text-danger">{error["designation"]}</label>
                )}
              </div>
              <div className="col-sm-6">
                <label className="col-form-label form-label">
                  Date of Joining <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  value={values.joinig_date}
                  name="joinig_date"
                  max={today_date}
                  className="form-control form-control-sm"
                  onChange={set("joinig_date")}
                />
                {error["joinig_date"] && (
                  <label className="text-danger">{error["joinig_date"]}</label>
                )}
              </div>
              <div className="col-sm-6">
                <label className="col-form-label form-label">UAN</label>
                <input
                  type="text"
                  value={values.uan}
                  name="uan"
                  max={100}
                  className="form-control  form-control-sm"
                  onChange={set("uan")}
                />
                {error["uan"] && (
                  <label className="text-danger">{error["uan"]}</label>
                )}
              </div>
              <div className="col-sm-6">
                <label className="col-form-label form-label">Total Working Days</label>
                <input
                  type="text"
                  value={values.total_working_days}
                  name="total_working_days"
                  max={100}
                  className="form-control  form-control-sm"
                  onChange={set("total_working_days")}
                />
                {error["total_working_days"] && (
                  <label className="text-danger">{error["total_working_days"]}</label>
                )}
              </div>
              <div className="col-sm-6">
                <label className="col-form-label form-label">LWP</label>
                <input
                  type="text"
                  value={values.lwp}
                  name="lwp"
                  maxLength={10}
                  onInput={only_number}
                  className="form-control  form-control-sm"
                  onChange={set("lwp")}
                />
                {error["lwp"] && (
                  <label className="text-danger">{error["lwp"]}</label>
                )}
              </div>
              <div className="col-sm-6">
                <label className="col-form-label form-label">Paid Days</label>
                <input
                  type="text"
                  value={values.total_paid_days}
                  name="total_paid_days"
                  maxLength={10}
                  onInput={only_number}
                  className="form-control  form-control-sm"
                  onChange={set("total_paid_days")}
                />
                {error["total_paid_days"] && (
                  <label className="text-danger">{error["total_paid_days"]}</label>
                )}
              </div>
              <div className="col-sm-6">
                <label className="col-form-label form-label">Bank Name</label>
                <input
                  type="text"
                  value={values.bank_name}
                  name="bank_name"
                  maxLength={10}
                  onInput={only_number}
                  className="form-control  form-control-sm"
                  onChange={set("bank_name")}
                />
                {error["bank_name"] && (
                  <label className="text-danger">{error["bank_name"]}</label>
                )}
              </div>
              <div className="col-sm-6">
                <label className="col-form-label form-label">Bank A/c No</label>
                <input
                  type="text"
                  value={values.ac_no}
                  name="ac_no"
                  maxLength={10}
                  onInput={only_number}
                  className="form-control  form-control-sm"
                  onChange={set("ac_no")}
                />
                {error["ac_no"] && (
                  <label className="text-danger">{error["ac_no"]}</label>
                )}
              </div>
              <div className="col-sm-6">
                <label className="col-form-label form-label">FSC Code</label>
                <input
                  type="text"
                  value={values.ifsc}
                  name="ifsc"
                  maxLength={10}
                  onInput={only_number}
                  className="form-control  form-control-sm"
                  onChange={set("ifsc")}
                />
                {error["ifsc"] && (
                  <label className="text-danger">{error["ifsc"]}</label>
                )}
              </div>
           
            
              <div className="col-sm-12">
                <hr />
                <h5>Earnings</h5>
                <hr />
              </div>
              {input_field &&
                input_field.map((item, index) => {
                  return (
                    <div className="col-sm-4" key={index}>
                      <label className="col-form-label form-label">
                        {item.label} <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control form-control-sm"
                        type="text"
                        value={item.value}
                        name={item.name}
                        onInput={only_number}
                        maxLength={10}
                        readOnly={item.readonly && item.readonly}
                        onChange={set(item.name)}
                      />
                      {error[item.name] && (
                        <label className="text-danger">{error[item.name]}</label>
                      )}
                    </div>
                  );
                })}
              <div className="col-sm-12">
                <hr />
                <h5>Deductions</h5>
                <hr />
              </div>
              <div className="col-sm-4">
                <label className="col-form-label form-label">
                  EPF (12%)<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={values.epf}
                  name="epf"
                  maxLength={10}
                  onInput={only_number}
                  className="form-control form-control-sm"
                  onChange={set("epf")}
                />
                {error["epf"] && (
                  <label className="text-danger">{error["epf"]}</label>
                )}
              </div>
              <div className="col-sm-4">
                <label className="col-form-label form-label">
                  Health Insurance/ESIC(0.75%)
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={values.health_ensurance}
                  name="health_ensurance"
                  onInput={only_number}
                  maxLength={10}
                  className="form-control form-control-sm"
                  onChange={set("health_ensurance")}
                />
                {error["health_ensurance"] && (
                  <label className="text-danger">
                    {error["health_ensurance"]}
                  </label>
                )}
              </div>
              <div className="col-sm-4">
                <label className="col-form-label form-label">
                  Professional Tax (Rs)<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={values.professional_tax}
                  name="professional_tax"
                  onInput={only_number}
                  maxLength={10}
                  className="form-control form-control-sm"
                  onChange={set("professional_tax")}
                />
                {error["professional_tax"] && (
                  <label className="text-danger">
                    {error["professional_tax"]}
                  </label>
                )}
              </div>
              <div className="col-sm-4">
                <label className="col-form-label form-label">If 80 G (Act)</label>
                <input
                  type="text"
                  value={values.if_80_g_act}
                  name="if_80_g_act"
                  maxLength={10}
                  onInput={only_number}
                  className="form-control form-control-sm"
                  onChange={set("if_80_g_act")}
                />
                {error["if_80_g_act"] && (
                  <label className="text-danger">{error["if_80_g_act"]}</label>
                )}
              </div>
              <div className="col-sm-4">
                <label className="col-form-label form-label">Gratuity</label>
                <input
                  type="text"
                  value={values.gratuity}
                  name="gratuity"
                  maxLength={10}
                  onInput={only_number}
                  className="form-control form-control-sm"
                  onChange={set("gratuity")}
                />
                {error["gratuity"] && (
                  <label className="text-danger">{error["gratuity"]}</label>
                )}
              </div>
              <div className="col-sm-4">
                <label className="col-form-label form-label">
                 Half Days 
                </label>
                <input
                  type="text"
                  value={values.half_day}
                  name="half_day"
                  maxLength={10}
                  onInput={only_number}
                  className="form-control form-control-sm"
                  onChange={set("half_day")}
                />
                {error["half_day"] && (
                  <label className="text-danger">{error["half_day"]}</label>
                )}
              </div>
              <div className="col-sm-4">
                <label className="col-form-label form-label">
                 Half Days Deduction
                </label>
                <input
                  type="text"
                  value={values.half_day_deduction}
                  name="half_day_deduction"
                  maxLength={10}
                  onInput={only_number}
                  className="form-control form-control-sm"
                  onChange={set("half_day_deduction")}
                />
                {error["half_day_deduction"] && (
                  <label className="text-danger">{error["half_day_deduction"]}</label>
                )}
              </div>
              <div className="col-sm-4">
                <label className="col-form-label form-label">
                  ID & Uniform first Month{" "}
                </label>
                <input
                  type="text"
                  value={values.id_uniform}
                  name="id_uniform"
                  maxLength={10}
                  onInput={only_number}
                  className="form-control form-control-sm"
                  onChange={set("id_uniform")}
                />
                {error["id_uniform"] && (
                  <label className="text-danger">{error["id_uniform"]}</label>
                )}
              </div>
              <div className="col-sm-12">
                <hr />
              </div>
              <div className="col-sm-6">
                <label className="col-form-label form-label">Net Pay</label>
                <input
                  type="text"
                  value={values.net_pay}
                  name="net_pay"
                  maxLength={10}
                  onInput={only_number}
                  className="form-control form-control-sm"
                  onChange={set("net_pay")}
                />
                {error["net_pay"] && (
                  <label className="text-danger">{error["net_pay"]}</label>
                )}
              </div>
              <div className="col-sm-6">
                <label className="col-form-label form-label">
                  Total Deduction
                </label>
                <input
                  type="text"
                  value={values.total_deduction}
                  name="total_deduction"
                  maxLength={10}
                  onInput={only_number}
                  className="form-control form-control-sm"
                  onChange={set("total_deduction")}
                />
                {error["total_deduction"] && (
                  <label className="text-danger">
                    {error["total_deduction"]}
                  </label>
                )}
              </div>
            </div>
            <div className="text-center py-3">
              <button
                type="submit"
                disabled={loading}
                className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
              >
                {loading && <i className="mdi mdi-dots-circle mdi-spin"></i>} Save
              </button>
              &nbsp;&nbsp;
              <button
                type="button"
                onClick={() => {
                  props.model_handler(false);
                }}
                className="btn btn-secondary btn-rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
    );
  };
export default DetailMdl