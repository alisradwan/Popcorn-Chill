import React, { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { Card, Form } from "react-bootstrap";
import { ADD_COMMENT } from '../utils/mutations';