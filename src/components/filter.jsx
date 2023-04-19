import React, { useState } from 'react';
import '../index.scss';

const ThemeFilter = ({ themes, onThemeChange }) => {

  return (
    <div className="w-full h-[150px] box-border mx-auto mx-120">
    <div className=" flex flex-col justify-between items-end w-[100%] h-[100%] box-border">
      <div className=" flex flex-row w-[undefinedundefined] box-border">
        <div className=" w-[199.53px] h-[100%] box-border">
          <div className=" flex flex-row justify-center items-center gap-2.5 w-[100%] h-[100%] px-3 py-[11px] box-border  bg-[rgba(245,245,245,1)]">
            <p className="  border-[#000000ff] text-xs leading-3  font-inter  font-[400]">
              Thèmes : tous
            </p>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/mxzl5i1xj2g-I20%3A675%3B8%3A12?alt=media&token=06f9eb96-793c-4c64-a6d1-3b719a8746b6"
              alt="Not Found"
              className=" w-[11.15px] h-[6.55px]"
            />
          </div>
        </div>
        <div className=" w-[199.53px] h-[100%] box-border">
          <div className=" flex flex-row justify-center items-center gap-2.5 w-[100%] h-[100%] px-3 py-[11px] box-border  bg-[rgba(245,245,245,1)]">
            <p className="  border-[#000000ff] text-xs leading-3  font-inter  font-[400]">
              Etat : concours actifs
            </p>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/mxzl5i1xj2g-I20%3A666%3B8%3A12?alt=media&token=d003cf39-6390-414e-8406-1dc91e2125c7"
              alt="Not Found"
              className=" w-[11.15px] h-[6.55px]"
            />
          </div>
        </div>
        <div className=" flex flex-row justify-center items-center  gap-[62px] w-[200px] h-[100%] p-2.5 box-border  bg-[rgba(217,217,217,1)]">
          <p className=" flex flex-col justify-center  border-[#000000ff] text-xs leading-3  font-inter  font-[400] text-center">
            Plus de critères
          </p>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/mxzl5i1xj2g-20%3A664?alt=media&token=2e1534cb-b9c0-42d3-95da-8e1404784b73"
            alt="Not Found"
            className=" w-[11.15px] h-[6.55px]"
          />
        </div>
      </div>
      <div className=" w-[100%] h-[100px] pr-[1px] pt-[19px] pb-4 box-border  bg-[rgba(217,217,217,1)] mx-120">
        <div className=" flex flex-col justify-center items-start gap-8 w-[100%] h-[100%] pl-6 pr-[25px] box-border">
          <div className=" flex flex-row justify-center items-start gap-2.5 w-[100%] h-[100%] box-border">
            <div className=" flex flex-col justify-between h-[100%] pt-0.5 box-border">
              <p className=" flex flex-col justify-center  border-[#000000ff] text-xs leading-3  font-inter  font-[400] text-center">
                Pays
              </p>
              <div className=" flex w-[100%] h-10 px-3 py-[11px] box-border  bg-[rgba(245,245,245,1)]">
                <p className="  border-[#000000ff] text-xs leading-3  font-inter  font-[400]">
                  France
                </p>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/mxzl5i1xj2g-I212%3A795%3B8%3A12?alt=media&token=1ea110bc-0b9c-4983-a6b2-7bb0c0e04743"
                  alt="Not Found"
                  className=" w-[11.15px] h-[6.55px]"
                />
              </div>
            </div>
            <div className=" flex flex-col justify-between h-[100%] pt-0.5 box-border">
              <p className=" flex flex-col justify-center  border-[#000000ff] text-xs leading-3  font-inter  font-[400] text-center">
                Région
              </p>
              <div className=" flex flex-row justify-center items-center gap-2.5 w-[100%] h-10 px-3 py-[11px] box-border  bg-[rgba(245,245,245,1)]">
                <p className="  border-[#000000ff] text-xs leading-3  font-inter  font-[400]">
                  Toutes
                </p>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/mxzl5i1xj2g-I212%3A798%3B8%3A12?alt=media&token=5fee737b-7e85-4928-878b-3add8e230ee4"
                  alt="Not Found"
                  className=" w-[11.15px] h-[6.55px]"
                />
              </div>
            </div>
            <div className=" flex flex-col justify-between h-[100%] pt-0.5 box-border">
              <p className="  border-[#000000ff] text-xs leading-3  font-inter  font-[400]">
                Département
              </p>
              <div className=" flex flex-row justify-center items-center gap-2.5 w-[100%] h-10 px-3 py-[11px] box-border  bg-[rgba(245,245,245,1)]">
                <p className="  border-[#000000ff] text-xs leading-3  font-inter  font-[400]">
                  Tous
                </p>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/mxzl5i1xj2g-I212%3A816%3B8%3A12?alt=media&token=dd8a6303-75af-4cc1-b58e-e396232a8c9e"
                  alt="Not Found"
                  className=" w-[11.15px] h-[6.55px]"
                />
              </div>
            </div>
            <div className=" flex flex-col justify-between h-[100%] pt-0.5 box-border">
              <p className="  border-[#000000ff] text-xs leading-3  font-inter  font-[400]">
                Catégorie (réservé aux)
              </p>
              <div className=" flex flex-row justify-center items-center gap-2.5 w-[100%] h-10 px-3 py-[11px] box-border  bg-[rgba(245,245,245,1)]">
                <p className="  border-[#000000ff] text-xs leading-3  font-inter  font-[400]">
                  Ouvert à tous
                </p>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/mxzl5i1xj2g-I212%3A823%3B8%3A12?alt=media&token=28a320b3-2a6d-460b-a0ef-d8c13aa12ff0"
                  alt="Not Found"
                  className=" w-[11.15px] h-[6.55px]"
                />
              </div>
            </div>
            <div className=" flex flex-col justify-between h-[100%] pt-0.5 box-border">
              <p className="  border-[#000000ff] text-xs leading-3  font-inter  font-[400]">
                Âge (réservé aux)
              </p>
              <div className=" flex flex-row justify-center items-center gap-2.5 w-[100%] h-10 px-3 py-[11px] box-border  bg-[rgba(245,245,245,1)]">
                <p className="  border-[#000000ff] text-xs leading-3  font-inter  font-[400]">
                  Tous
                </p>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/mxzl5i1xj2g-I212%3A829%3B8%3A12?alt=media&token=fc51f468-0098-4585-8e4c-9ac08bb32577"
                  alt="Not Found"
                  className=" w-[11.15px] h-[6.55px]"
                />
              </div>
            </div>
            <div className=" flex flex-col justify-between h-[100%] pt-0.5 box-border">
              <p className="  border-[#000000ff] text-xs leading-3  font-inter  font-[400]">
                Prix/dotations
              </p>
              <div className=" flex flex-row justify-center items-center gap-2.5 w-[100%] h-10 box-border  bg-[rgba(245,245,245,1)]">
                <p className="  border-[#000000ff] text-xs leading-3  font-inter  font-[400]">
                  Tous
                </p>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/mxzl5i1xj2g-I212%3A838%3B8%3A12?alt=media&token=31d31f59-bf39-4106-8423-85356f55fda2"
                  alt="Not Found"
                  className=" w-[11.15px] h-[6.55px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ThemeFilter;