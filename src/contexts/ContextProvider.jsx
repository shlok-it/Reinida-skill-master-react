import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const StateContext = createContext({
    currentUser: {},
    state_list: [],
    district_list: [],
    block_list: [],
    subject_list: [],
    qualifications_list: [],
    bloodgroup: [],
    categories: [],
    toast: {
        message: null,
        show: false,
    },
    setCurrentUser: () => { },
    setStateList: () => { },
    setDistrictList: () => { },
    setBlockList: () => { },
});

export const ContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});
    const [state_list, setStateList] = useState([]);
    const [district_list, setDistrictList] = useState([]);
    const [block_list, setBlockList] = useState([]);
    const [subject_list, setSubjectList] = useState([]);
    const [qualifications_list, setQualifications] = useState([]);
    const [village_list, setVillageList] = useState([]);
    const [bloodgroup, setBloodgroup] = useState([]);
    const [categories, setCategories] = useState([]);
    const [toast, setToast] = useState({ message: '', show: false })

    const showToast = (message) => {
        setToast({ message, show: true })
        setTimeout(() => {
            setToast({ message: '', show: false })
        }, 5000)
    }

    return (
        <StateContext.Provider
            value={{
                currentUser,
                state_list,
                district_list,
                block_list,
                subject_list,
                village_list,
                bloodgroup,
                categories,
                qualifications_list,
                setCurrentUser,
                setStateList,
                setDistrictList,
                setSubjectList,
                setBlockList,
                setQualifications,
                setVillageList,
                setBloodgroup,
                setCategories,
                toast,
                showToast
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);