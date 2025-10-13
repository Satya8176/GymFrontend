import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function ViewTest({ exercisesTested,reTest,enrollmentId}) {
  const navigate=useNavigate();

  return (
    <div>
      {exercisesTested.length > 0 ? (
        <div className="rounded-t-sm overflow-hidden mt-2">
          <table className=" min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700 ">
              <tr className="rounded-lg">
                <th className="px-6 py-1.5 w-[25%] text-left text-[14px] text-gray-500 dark:text-gray-200 tracking-wider">
                  Exercise
                </th>
                <th className="px-6 py-1.5 w-[25%] text-left text-[14px] text-gray-500 dark:text-gray-200 tracking-wider">
                  Max Weight
                </th>
                <th className="px-6 py-1.5 w-[25%] text-left text-[14px] text-gray-500 dark:text-gray-200 tracking-wider">
                  Max Reps
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {exercisesTested.map((obj, index) => (
                <motion.tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 "
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-1.5 w-[25%] whitespace-nowrap">
                    <div className="text-[14px] font-medium text-gray-900 dark:text-white">
                      {obj.name || obj.exercise.name}
                    </div>
                  </td>
                  <td className="px-6 py-1.5 w-[25%] whitespace-nowrap">
                    <div className="text-[14px] font-medium text-gray-900 dark:text-white">
                      {obj.maxWeight} KG
                    </div>
                  </td>
                  <td className="px-6 py-1.5 w-[25%] whitespace-nowrap">
                    <div className="text-[14px] font-medium text-gray-900 dark:text-white">
                      {obj.maxReps}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          <button className={`w-fit h-fit text-black font-bold hover:text-yellow-900 py-1 px-2 bg-yellow-400 rounded-sm hover:scale-95 mt-3 ${reTest ?(""):("hidden")} relative`}
          type="button"
          // How i can navigate so that it take restest 
          //We can do like when press on retest then delete this user entry from the table then go to testLanding
          onClick={()=>{
            navigate(`/test/take-test/${enrollmentId}`)
          }}
          >
            Retest
          </button>
        </div>
      ) : (
        <div>No Exerices is tested</div>
      )}
    </div>
  );
}

export default ViewTest;
