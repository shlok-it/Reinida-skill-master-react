import React, { useEffect, useState } from "react";
import { formatDateTime } from "../../helper/general.js"
import { call_secure_api } from "../../connect/api";
const ActivitySection = (props) => {
    const [activity_list, SetActivity] = useState([]);
    const [loading, setLoading] = useState(false);
    const administrator_id = props.administrator_id;
    useEffect(() => {
        get_activity();
    }, []);
    const get_activity = () => {
        call_secure_api('v1/master/administrator/activity', { administrator_id: administrator_id })
            .then(
                (resolve) => {
                    if (resolve.status === true) {
                        SetActivity(resolve.data.list);
                    }
                    else {
                        SetActivity([]);
                    }
                },
                (reject) => {
                    console.log(reject);
                }
            )
    }
    return (
        <>
            {activity_list.map((item, index) => {
                return (
                    <div key={index} className="acitivity-item d-flex border-bottom">
                        <div className="flex-shrink-0">
                            <img src={process.env.PUBLIC_URL + "/assets/images/" + item.deviceType + ".png"} alt={item.deviceType} className="avatar-xs rounded-circle acitivity-avatar shadow" />
                        </div>
                        <div className="flex-grow-1 ms-3">
                            <h6 className="mb-1">{item.browserName}
                                {item.session_status == 1 && <span className="text bg-success-subtle text-success align-middle">Active</span>}
                                {item.session_status != 1 && <span className="text bg-danger-subtle text-danger align-middle">Logout</span>}
                            </h6>
                            <p className="text-muted mb-1">{item.platformName}</p>
                            <small className="mb-0 text-muted">{formatDateTime(item.created_at, 'string')}</small>
                        </div>
                    </div>)
            })}
        </>
    );
}
export default ActivitySection;