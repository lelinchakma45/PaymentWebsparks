
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
export default function Calender() {
    useEffect(()=>{
        (async function () {
          const cal = await getCalApi({"namespace":"15min"});
          cal("ui", {"theme":"dark","cssVarsPerTheme":{"dark":{"cal-brand":"#000000", }},"hideEventTypeDetails":false,"layout":"month_view"});
        })();
    }, [])
    return (
        <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white p-8">
            <div className="max-w-8xl mx-auto">
                <Cal namespace="15min"
                    calLink="websparks-ai/15min"
                    style={{ width: "100%", height: "100%", overflow: "scroll" }}
                    config={{ "layout": "month_view", "theme":"dark" }}
                />
            </div>
        </div>
    );
};