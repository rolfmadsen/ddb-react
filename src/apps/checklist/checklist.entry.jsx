import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Checklist from "./checklist";
import MaterialList from "../../core/MaterialList";
import OpenPlatform from "../../core/OpenPlatform";

const client = new MaterialList();

/**
 * @param {object} item - the OpenPlatform item (i.e. material info)
 * @memberof ChecklistEntry
 * @returns {object} - the item data with modified values and property names.
 */
function formatResult(item) {
  return {
    ...item,
    creator: item.dcCreator ? item.dcCreator : item.creator,
    title: item.dcTitleFull,
    type: item.typeBibDKType,
    year: item.date
  };
}

/**
 * @param {object} - object with the URL for the material and author URL.
 * @memberof ChecklistEntry
 * @returns {ReactNode}
 */
function ChecklistEntry({ materialUrl, authorUrl, removeButtonText }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState("inactive");

  useEffect(function getList() {
    setLoading("active");
    client
      .getList()
      .then(function onResult(result) {
        const op = new OpenPlatform();
        return op.getWork({
          pids: result,
          fields: [
            "dcTitleFull",
            "pid",
            "coverUrlThumbnail",
            "dcCreator",
            "creator",
            "typeBibDKType",
            "date"
          ]
        });
      })
      .then(result => {
        setList(result.map(formatResult));
      })
      .catch(function onError() {
        setList([]);
      })
      .finally(function onEnd() {
        setLoading("finished");
      });
  }, []);

  /**
   * Function to remove a material from the list.
   *
   * @param {string} materialId - the material ID / pid.
   * @memberof ChecklistEntry
   */
  function onRemove(materialId) {
    const fallbackList = [...list];
    setList(
      list.filter(function removeMaterial(item) {
        return item.pid !== materialId;
      })
    );
    client.deleteListMaterial({ materialId }).catch(function onError() {
      setTimeout(function onRestore() {
        setList(fallbackList);
      }, 2000);
    });
  }
  return (
    <Checklist
      loading={loading}
      items={list}
      onRemove={onRemove}
      materialUrl={materialUrl}
      authorUrl={authorUrl}
      removeButtonText={removeButtonText}
    />
  );
}

ChecklistEntry.propTypes = {
  materialUrl: PropTypes.string.isRequired,
  authorUrl: PropTypes.string.isRequired,
  removeButtonText: PropTypes.string
};

ChecklistEntry.defaultProps = {
  removeButtonText: "Fjern fra listen"
};

export default ChecklistEntry;
